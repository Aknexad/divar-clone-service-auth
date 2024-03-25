import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { generateErrorMessage } from 'zod-error';

export const validation =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      const formateError = generateErrorMessage(error.issues);

      return res.status(400).json(formateError);
    }
  };
