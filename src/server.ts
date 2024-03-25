import express from 'express';
import { AmqpConnection } from '@Aknexad/mq-hub';

import expressApp from './express-app';
import { ENV } from './configs';
import { rabbitMq } from './utility';

const amqpConnection = new AmqpConnection();

const startServer = async () => {
  const app = express();

  const rabbitMqConnection = await amqpConnection.AmqpConnections(ENV.RABBIT_MQ_URL);

  const channel = await amqpConnection.CreateChannel(rabbitMqConnection);

  await rabbitMq.createExchangeAndQues(channel);

  await expressApp(app, channel);

  console.log('connect to RabbitMQ');

  app
    .listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    })
    .on('error', err => {
      console.log(err);
      amqpConnection.CLoseChannel();
      amqpConnection.CloseConnection();
      process.exit();
    })
    .on('close', () => {
      amqpConnection.CLoseChannel();
      amqpConnection.CloseConnection();
    });

  rabbitMqConnection.on('error', async err => {
    if (err === 'close') {
      await amqpConnection.ReconnectionToRabbitMq(ENV.RABBIT_MQ_URL);
    }
  });
};

startServer();
