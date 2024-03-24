import {} from 'module';

export interface IUerLogics {
  Registering(phone: string): Promise<any>;

  verifyOtp(phone: string, otpCode: string): Promise<any>;

  logIn(phone: string): Promise<any>;

  logOut(userId: string): Promise<any>;
}
