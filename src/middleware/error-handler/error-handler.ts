// import { createLogger, transports } from 'winston';
import { Request, Response, NextFunction } from 'express';

import { AppError } from '../../utility/';

export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
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
  if (err instanceof AppError) {
    return res.status(err.httpCode).json({ err });
  }

  if (!isOperationalError(err)) {
    process.exit(1);
    // restart app
  }

  return res.status(500).json({ err });
};
