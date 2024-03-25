import { Channel } from 'amqplib';
import express, { Request, Response, NextFunction, Router } from 'express';

import { service } from '../../domain';
import { validationHandler } from '../../middleware';
import { validation } from '../../utility';

const router = express.Router();

const userLogic = new service.userLogic.UsersLogic();

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

  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userLogic.logIn(req.body.phone);
      res.status(200).json({ message: '', statusCode: 2000, response: result });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/logout', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userLogic.logOut('123');
      res.status(200).json({ message: '', statusCode: 2000, response: result });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
