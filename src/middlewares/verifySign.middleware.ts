import { RequestHandler } from 'express';
import HttpException from '@exceptions/HttpException';
import { AddMailDto } from '@dtos/issuer.dto';
import { fromRpcSig, hashPersonalMessage, ecrecover, pubToAddress } from 'ethereumjs-util';

const verifySignMiddleware = (): RequestHandler => {
  return (req, res, next) => {
    try {
      const submittedData: AddMailDto = req.body;
      const signer = SignRecoverer(submittedData.msg, submittedData.sig);
      console.log('signer=', signer);
      if (submittedData.did.split(':').slice(-1)[0].toLowerCase() !== signer.toLowerCase())
        next(new HttpException(401, '#1619960899 Invalid signature'));
      next();
    } catch (error) {
      next(new HttpException(404, '#1619960907 Missing parameter. ' + error.message));
    }
  };
};

const SignRecoverer = (msg: string, sig: string) => {
  const { v, r, s } = fromRpcSig(sig);
  const msgHash = hashPersonalMessage(Buffer.from(msg));
  return `0x${pubToAddress(ecrecover(msgHash, v, r, s)).toString('hex')}`;
};

export default verifySignMiddleware;
