import { User } from '@prisma/client';

export type CreteNewUserInput = {
  phone: string;
  otpCode: string;
  expiration: string;
};

export interface IUserRepository {
  CreateNewUser(data: CreteNewUserInput): Promise<any>;
  FindUserByPhone(phone: string): Promise<User | null>;
  FindUserById(userId: string): Promise<User | null>;
  FindUserOtoByUserId(userId: string): Promise<any>;
  FindUserOtpByUserPhone(phone: string): Promise<any>;

  UpdateUserStatus(userId: string, status: string): Promise<any>;
}
