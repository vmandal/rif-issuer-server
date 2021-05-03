import { Router } from 'express';
import IssuerController from '@controllers/issuer.controller';
import { SendVerificationMailDto, AddMailDto } from '@dtos/issuer.dto';
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
  }
}

export default IssuerRoute;
