import { Channel } from 'amqplib';

export interface IUerLogics {
  Registering(phone: string, channel: Channel): Promise<any>;

  logIn(phone: string, code: string): Promise<any>;

  logOut(userId: string): Promise<any>;
}
