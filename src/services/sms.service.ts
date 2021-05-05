import { Twilio } from 'twilio';
import { TwilioCreateDto } from 'dtos/issuer.dto';

class SmsService {
  private _accountSid: string;
  private _authToken: string;

  constructor() {
    this._accountSid = process.env.TWILIO_ACCOUNT_SID;
    this._authToken = process.env.TWILIO_AUTH_TOKEN;
  }

  smsCode(tc: TwilioCreateDto): Promise<void> {
    const client = new Twilio(this._accountSid, this._authToken);
    return new Promise<void>((resolve: (msg: any) => void, reject: (err: Error) => void) => {
      client.messages
        .create(tc)
        .then(message => {
          console.log(`Message Sent ${message.sid}`);
          resolve(`Message Sent ${message.sid}`);
        })
        .catch(error => {
          console.log(`error: ${error}`);
          reject(error);
        });
    });
  }
}

export default SmsService;
