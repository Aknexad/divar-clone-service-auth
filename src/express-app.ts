import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import auth from './entry-points/api/auth';
import otp from './entry-points/api/otp';
import security from './entry-points/api/security';
import { errorHandler, isOperationalError } from './middleware';
import { Channel } from 'amqplib';

export default async (app: Application, channel: Channel) => {
  app.use(express.json());
  app.use(helmet());
  app.use(cors());

  app.use('/auth', auth(channel));
  app.use('/otp', otp(channel));
  app.use('/security', security(channel));

  app.use(errorHandler);

  process.on('uncaughtException', (reason: string, p: Promise<any>) => {
    throw reason;
  });

  process.on('unhandledRejection', (error: Error) => {
    if (!isOperationalError(error)) {
      process.exit(1);
    }
  });
};
