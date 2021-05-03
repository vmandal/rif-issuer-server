import { NextFunction, Request, Response } from 'express';
import SMTPService from '@services/smtp.service';
import EmailConfig from '../configs/email.json';
import { SendVerificationMailDto, DidCodeAssetDto, AddMailDto } from '@dtos/issuer.dto';
import { randomBytes } from 'crypto';
import IssuerService from '@services/issuer.service';
import { isEmpty } from '@utils/util';

class IssuerController {
  public issuerService = new IssuerService();

  public sendVerificationMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('req.body=', req.body);
      const submittedData: SendVerificationMailDto = req.body;
      const code = randomBytes(32).toString('hex');

      try {
        const dcaData: DidCodeAssetDto = { did: submittedData.did, code: code, asset: submittedData.email };
        this.issuerService.createDidCode(dcaData).then(result => {
          console.log('result=', result);
          const mailService = new SMTPService({
            from: EmailConfig.Email_From,
            SmtpServerConnectionString: `smtp://${EmailConfig.SMTP_HOST}:${EmailConfig.SMTP_PORT}`,
          });
          mailService
            .sendMail(submittedData.email, 'Verification code', 'code:' + code)
            .then(msg => {
              console.log(`sendMail result :(${msg})`);
              res.status(200).json({ message: 'Mail sent' });
            })
            .catch(error => {
              res.status(400).json({ message: 'Mail not sent. SMTP error. ' + error });
            });
        });
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  };

  public addMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submittedData: AddMailDto = req.body;

      try {
        const code = submittedData.msg.split(':')[1];
        if (isEmpty(code)) {
          res.status(400).json({ message: 'Empty code.' });
          return;
        }
        this.issuerService.getDidCodeAsset(code).then(dca => {
          if (dca === null) {
            res.status(400).json({ message: 'Invalid code.' });
          } else {
            this.issuerService.getJwt(submittedData.did, dca.asset).then(jwt => {
              if (jwt === null || isEmpty(jwt)) {
                // create new jwt
                this.issuerService
                  .createJwt(submittedData.did, dca.asset)
                  .then(jwt => {
                    // save in DB
                    this.issuerService
                      .storeIssuedCredential({ did: submittedData.did, jwt, type: 'email', asset: dca.asset })
                      .then(() => {
                        res.status(200).send({ message: 'New credentials verified', jwt });
                      })
                      .catch(error => {
                        res.status(500).json({ message: '#1620036181 DB save failed. ' + error });
                      });
                  })
                  .catch(error => {
                    res.status(500).json({ message: '#1620036188 create Jwt failed. ' + error });
                  });
              } else {
                res.status(200).send({ message: 'Credentials verified', jwt });
              }
            });
          }
        });
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  };
}

export default IssuerController;
