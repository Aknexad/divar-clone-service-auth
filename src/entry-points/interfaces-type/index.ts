import { Channel } from 'amqplib';

export type RouterParameterData = {
  channel: Channel;
  rpcChannel?: Channel;
};

interface AuthenticatedUser {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      userInfo: AuthenticatedUser;
    }
  }
}
