import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

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
      // const formateError = generateErrorMessage(error.issues, {});

      if (error instanceof ZodError) {
        const customErrors = error.errors.map((err: any) => {
          return {
            code: err.code,
            message: err.message,
            expected: err.expected,
            received: err.received,
            fail: err.path[0],
          };
        });

        return res.status(200).json({
          statusCode: 2100,
          message: 'validation error',
          respond: customErrors,
        });
      }
    }
  };
