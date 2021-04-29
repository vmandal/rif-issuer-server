import { NextFunction, Request, Response } from 'express';
// import emailService from '@services/email.service';
import { SendVerificationMailDto } from '@dtos/issuer.dto';

class IssuerController {
  // public emailService = new emailService();

  public sendVerificationMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const email = Number(req.params.email);
      // const did = Number(req.params.did);
      console.log('req.body=', req.body)
      const verificationMailFormData: SendVerificationMailDto = req.body;
      res.status(200).json({ message: 'reached IssuerController - sendVerificationMail' });
    } catch (error) {
      next(error);
    }
  };

  /*
  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
  */
}

export default IssuerController;
