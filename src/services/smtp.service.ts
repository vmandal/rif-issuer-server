import * as nodemailer from 'nodemailer';
import { iEmailSettings } from '../interfaces/email.interface';

class SMTPService {
  private _transporter: nodemailer.Transporter;
  private _emailSettings: iEmailSettings;

  constructor(emailSettings: iEmailSettings) {
    this._emailSettings = emailSettings;
    this._transporter = nodemailer.createTransport(this._emailSettings.SmtpServerConnectionString);
  }

  sendMail(to: string, subject: string, content: string): Promise<void> {
    const options = {
      from: this._emailSettings.from,
      to: to,
      subject: subject,
      text: content,
    };

    return new Promise<void>((resolve: (msg: any) => void, reject: (err: Error) => void) => {
      this._transporter.sendMail(options, (error, info) => {
        if (error) {
          console.log(`error: ${error}`);
          reject(error);
        } else {
          console.log(`Message Sent ${info.response}`);
          resolve(`Message Sent ${info.response}`);
        }
      });
    });
  }
}

export default SMTPService;
