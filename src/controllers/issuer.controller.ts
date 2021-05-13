import { NextFunction, Request, Response } from 'express';
import SMTPService from '@services/smtp.service';
import SmsService from '@services/sms.service';
import { SendVerificationMailDto, DidCodeAssetDto, AddMailDto, SmsCodeDto, AddMobileDto, TwilioCreateDto } from '@dtos/issuer.dto';
import { randomBytes } from 'crypto';
import IssuerService from '@services/issuer.service';
import { isEmpty } from '@utils/util';
import HttpException from '@exceptions/HttpException';

class IssuerController {
  public issuerService = new IssuerService();

  public sendSmsCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('req.body=', req.body);
      const submittedData: SmsCodeDto = req.body;
      const code = randomBytes(4).toString('hex');

      try {
        const dcaData: DidCodeAssetDto = { did: submittedData.did, code: code, asset: submittedData.mobile };
        this.issuerService.createDidCode(dcaData).then(result => {
          console.log('result=', result);
          const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
          if (isEmpty(twilioNumber)) {
            next(new HttpException(500, '#1620215493 SMS config missing'));
            return;
          }
          const twilioData: TwilioCreateDto = { to: submittedData.mobile, from: twilioNumber, body: 'Rsk verify: ' + code };
          const smsService = new SmsService();
          // res.status(200).json({ message: 'ok' });
          smsService
            .smsCode(twilioData)
            .then(msg => {
              console.log(`smsCode() response :(${msg})`);
              res.status(200).json({ message: 'SMS sent' });
            })
            .catch(error => {
              console.log(error);
              res.status(400).json({ message: 'SMS not sent. Error: ' + error.message });
            });
        });
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  };

  public addMobile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submittedData: AddMobileDto = req.body;

      try {
        const code = submittedData.msg.split(':')[1];
        if (isEmpty(code)) {
          res.status(400).json({ message: 'Empty code.' });
          return;
        }
        this.issuerService.getDidCodeAsset({ code: code, did: submittedData.did }).then(dca => {
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
                      .storeIssuedCredential({ did: submittedData.did, jwt, type: 'sms', asset: dca.asset })
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

  public sendVerificationMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('req.body=', req.body);
      const submittedData: SendVerificationMailDto = req.body;
      const code = randomBytes(4).toString('hex');

      try {
        const dcaData: DidCodeAssetDto = { did: submittedData.did, code: code, asset: submittedData.email };
        this.issuerService.createDidCode(dcaData).then(result => {
          console.log('result=', result);
          const mailService = new SMTPService({
            from: process.env.EMAIL_FROM,
            SmtpServerConnectionString: `smtp://${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`,
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
        this.issuerService.getDidCodeAsset({ code: code, did: submittedData.did }).then(dca => {
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
                        // delete code
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
