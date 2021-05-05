import DB from '@databases';
import { DidCodeAssetDto, IssuedCredentialDto, DidCodeDto } from '@dtos/issuer.dto';
import HttpException from '@exceptions/HttpException';
import { iDidCodeAsset, iIssuedCredentials } from '@interfaces/didCode.interface';
import { isEmpty } from '@utils/util';
import { rskDIDFromPrivateKey, rskTestnetDIDFromPrivateKey } from '@rsksmart/rif-id-ethr-did';
import { Issuer, createVerifiableCredentialJwt } from 'did-jwt-vc';

class IssuerService {
  private didCodes = DB.DidCodes;
  private IssuedCredentials = DB.IssuedCredentials;

  public async createDidCode(dcaData: DidCodeAssetDto): Promise<iDidCodeAsset> {
    if (isEmpty(dcaData)) throw new HttpException(400, '#1619858226 Parameter empty');
    const dca: iDidCodeAsset = await this.didCodes.create({ ...dcaData });
    return dca;
  }

  public async getDidCodeAsset(dc: DidCodeDto): Promise<iDidCodeAsset | null> {
    const dca: iDidCodeAsset = await this.didCodes.findOne({ where: dc });
    if (dca == null) return null;

    // delete code - one time use only
    await this.didCodes.destroy({ where: { did: dc.did, code: dc.code } });

    // todo: expirationTime check process.env.CODE_EXPIRE_TIME
    return dca;
  }

  public getIssuer() {
    const privateKey = process.env.ISSUER_PRIVATE_KEY;
    if (isEmpty(privateKey)) throw new HttpException(500, '#1620018381 Server configuration incomplete');
    const issuer: Issuer = process.env.networkName === 'rsk:testnet' ? rskTestnetDIDFromPrivateKey()(privateKey) : rskDIDFromPrivateKey()(privateKey);
    return issuer;
  }

  public async getJwt(did: string, asset: string): Promise<string | null> {
    // check for exiting jwt
    const ic: iIssuedCredentials = await this.IssuedCredentials.findOne({ where: { did, asset } });
    if (ic !== null) {
      return ic.jwt;
    } else {
      return null;
    }
  }

  public async createJwt(did: string, asset: string) {
    // create new jwt
    return createVerifiableCredentialJwt(
      {
        issuanceDate: new Date(),
        sub: did,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Email'],
          credentialSchema: {
            id: process.env.ISSUER_DID,
            type: process.env.ISSUER_TYPE,
          },
          credentialSubject: { asset },
        },
      },
      this.getIssuer(),
    );
  }

  public async storeIssuedCredential(icData: IssuedCredentialDto): Promise<iIssuedCredentials> {
    if (isEmpty(icData)) throw new HttpException(400, '#1619858226 Parameter empty');
    const ic: iIssuedCredentials = await this.IssuedCredentials.create({ ...icData });
    return ic;
  }
}

export default IssuerService;
