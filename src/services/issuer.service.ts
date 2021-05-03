import DB from '@databases';
import { DidCodeAssetDto, IssuedCredentialDto } from '@dtos/issuer.dto';
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

  public async getDidCodeAsset(code: string): Promise<iDidCodeAsset | null> {
    if (isEmpty(code)) throw new HttpException(400, '#1619934706 Parameter empty');
    const dca: iDidCodeAsset = await this.didCodes.findOne({ where: { code } });
    // todo: expirationTime check
    return dca;
  }

  public getIssuer() {
    const privateKey = process.env.PRIVATE_KEY;
    if (isEmpty(privateKey)) throw new HttpException(500, '#1620018381 Server configuration incomplete');
    const issuer: Issuer = process.env.networkName === 'rsk:testnet' ? rskTestnetDIDFromPrivateKey()(privateKey) : rskDIDFromPrivateKey()(privateKey);
    return issuer;
  }

  public async getJwt(did: string, asset: string): Promise<string | null> {
    // check for exiting jwt
    const ic: iIssuedCredentials = await this.IssuedCredentials.findOne({ where: { did, asset } });
    if (ic !== null) {
      console.log('exisitng jwt', ic);
      return ic.jwt;
    } else {
      return null;
    }
  }

  public async getJwt2(did: string, asset: string): Promise<string> {
    // check for exiting jwt
    const ic: iIssuedCredentials = await this.IssuedCredentials.findOne({ where: { did, asset } });
    if (ic !== null) {
      console.log('exisitng jwt', ic);
      return ic.jwt;
    } else {
      console.log('create new jwt');
      this.createJwt(did, asset).then(jwt => {
        console.log('new jwt', jwt);
        this.storeIssuedCredential({ did, jwt, type: 'email', asset }).then(() => {
          console.log('storeIssuedCredential done');
          return jwt;
        });
      });
      throw new HttpException(500, '#1620032537 Failed to create jwt');
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
            id: 'did:ethr:rsk:0x8a32da624dd9fad8bf4f32d9456f374b60d9ad28;id=1eb2af6b-0dee-6090-cb55-0ed093f9b026;version=1.0',
            type: 'JsonSchemaValidator2018',
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
