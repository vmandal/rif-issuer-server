import { Router } from 'express';
import IssuerController from '@controllers/issuer.controller';
import { SendVerificationMailDto, AddMailDto, SmsCodeDto, AddMobileDto } from '@dtos/issuer.dto';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import verifySignMiddleware from '@middlewares/verifySign.middleware';

class IssuerRoute implements Route {
  public path = '/issuer';
  public router = Router();
  public issuerController = new IssuerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/mailCode`, validationMiddleware(SendVerificationMailDto, 'body'), this.issuerController.sendVerificationMail);
    this.router.post(`${this.path}/addMail`, validationMiddleware(AddMailDto, 'body'), verifySignMiddleware(), this.issuerController.addMail);
    this.router.post(`${this.path}/smsCode`, validationMiddleware(SmsCodeDto, 'body'), this.issuerController.sendSmsCode);
    this.router.post(`${this.path}/AddMobile`, validationMiddleware(AddMobileDto, 'body'), verifySignMiddleware(), this.issuerController.addMobile);
  }
}

export default IssuerRoute;
