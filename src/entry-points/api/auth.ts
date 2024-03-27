import { Channel } from 'amqplib';
import express, { Request, Response, NextFunction, Router } from 'express';

import { service } from '../../domain';
import { validationHandler, verification } from '../../middleware';
import { validation } from '../../utility';

const router = express.Router();

const userLogic = new service.userLogic.UsersLogic();
const tokensLogic = new service.tokensLogic.TokensLogic();

export default function advertisementRoute(channel: Channel): Router {
  router.post(
    '/register',
    validationHandler.validation(validation.registerUser),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await userLogic.Registering(req.body.phone, channel);
        res.status(200).json({ message: '', statusCode: 2000, response: result });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/verify',
    validationHandler.validation(validation.verifyOtp),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await userLogic.verifyAccount(req.body.phone, req.body.code);
        res.status(200).json({ message: '', statusCode: 2000, response: result });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/login',
    validationHandler.validation(validation.logIn),
    verification.lotInOtp,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.userInfo;
        const result = await tokensLogic.CreateTokens(userId);
        res.status(200).json({ message: '', statusCode: 2000, response: result });
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete('/logout', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessTokens = req.headers.authorization?.split(' ')[1];

      const result = await userLogic.logOut(accessTokens);
      res.status(200).json({ message: '', statusCode: 2000, response: result });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
