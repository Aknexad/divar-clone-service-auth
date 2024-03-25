import { User } from '@prisma/client';

export type CreteNewUserInput = {
  phone: string;
  otpCode: string;
  expiration: string;
};

export interface IUserRepository {
  CreateNewUser(data: CreteNewUserInput): Promise<User>;
  FindUserByPhone(phone: string): Promise<User | null>;
  FindUserById(userId: string): Promise<User | null>;
  FindUserOtoByUserId(userId: string): Promise<any>;
  FindUserOtpByUserPhone(phone: string): Promise<any>;

  UpdateUserStatus(userId: string, status: string): Promise<any>;
}

export type CreateTokensInput = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessExpirationDate: Date | string;
  refreshExpirationDate: Date | string;
};
