import { Channel } from 'amqplib';
import express, { Request, Response, NextFunction, Router } from 'express';

import { service } from '../../domain';
import { validationHandler } from '../../middleware';
import { validation } from '../../utility';

const router = express.Router();

const otpLogic = new service.otpLogic.OtpLogic();

export default function advertisementRoute(channel: Channel): Router {
  router.post(
    '/send',
    validationHandler.validation(validation.registerUser),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await otpLogic.SenOtp(req.body.phone, channel);
        res.status(200).json({ statusCode: 2000, message: '', response: result });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/resend',
    validationHandler.validation(validation.registerUser),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await otpLogic.reSendOtp(req.body.phone, channel);
        res.status(200).json({ statusCode: 2000, message: '', response: result });
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
        const { phone, code } = req.body;
        const result = await otpLogic.verifyOtp(phone, code);
        res.status(200).json({ statusCode: 2000, message: '', response: result });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
