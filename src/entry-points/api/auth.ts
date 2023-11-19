import express, { Request, Response, NextFunction, Router } from 'express';

const router = express.Router();

export default function advertisementRoute(): Router {
  router.post(
    'register',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = '';
        res.status(200).json({ msg: '', payload: result });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = '';
        res.status(200).json({ msg: '', payload: result });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/send-otp',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = '';
        res.status(200).json({ msg: '', payload: result });
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/new-access-token',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = '';
        res.status(200).json({ msg: '', payload: result });
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    '/logout',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = '';
        res.status(200).json({ msg: '', payload: result });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
