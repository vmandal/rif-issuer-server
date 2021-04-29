import { Router } from 'express';
import IssuerController from '@controllers/issuer.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { SendVerificationMailDto } from '@dtos/issuer.dto';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class IssuerRoute implements Route {
  public path = '/issuer';
  public router = Router();
  public issuerController = new IssuerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //this.router.get(`${this.path}/mailCode`, this.issuerController.sendVerificationMail);
    //this.router.get(`${this.path}/mailCode`, validationMiddleware(SendVerificationMailDto, 'body'), this.issuerController.sendVerificationMail);
    this.router.post(`${this.path}/mailCode`, validationMiddleware(SendVerificationMailDto, 'body'), this.issuerController.sendVerificationMail);
    /*
    this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
    */
  }
}

export default IssuerRoute;
