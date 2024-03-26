import { ExchangeQueue } from '@Aknexad/mq-hub';
import { Channel } from 'amqplib';

const createExchangeAndQues = async (channel: Channel) => {
  const createExchange = new ExchangeQueue();

  await createExchange.AssertExchange({
    channel: channel,
    exchangeName: 'notifications',
    exchangeType: 'direct',
    exchangeOptions: {
      durable: true,
    },
  });

  const sendSms = await createExchange.AssertQueue(channel, 'send-otp');

  await createExchange.BindingQueue(
    channel,
    sendSms,
    'notifications',
    'notifications.send.otp'
  );
};

export { createExchangeAndQues };
