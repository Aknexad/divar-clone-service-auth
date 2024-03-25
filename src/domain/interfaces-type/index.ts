import { Channel } from 'amqplib';

export interface IUerLogics {
  Registering(phone: string, channel: Channel): Promise<any>;

  verifyOtp(phone: string, otpCode: string): Promise<any>;

  logIn(phone: string): Promise<any>;

  logOut(userId: string): Promise<any>;
}
