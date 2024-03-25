// import { createLogger, transports } from 'winston';
import { Request, Response, NextFunction } from 'express';

import { appError } from '../../utility/';

export const isOperationalError = (error: Error): boolean => {
  if (error instanceof appError.AppError) {
    return error.isOperational;
  }
  return false;
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof appError.AppError) {
    return res
      .status(err.httpCode)
      .json({ message: '', statusCode: err.httpCode, response: err.message });
  }

  if (!isOperationalError(err)) {
    process.exit(1);
    // restart app
  }

  return res.status(500).json({ err });
};
