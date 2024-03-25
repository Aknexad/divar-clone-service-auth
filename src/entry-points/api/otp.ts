import { Channel } from 'amqplib';
import express, { Request, Response, NextFunction, Router } from 'express';

const router = express.Router();

export default function advertisementRoute(channel: Channel): Router {
  router.post('/resend', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = '';
      res.status(200).json({ message: '', statusCode: 2000, response: result });
    } catch (error) {
      next(error);
    }
  });

  return router;
}