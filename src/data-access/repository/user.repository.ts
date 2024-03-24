import { PrismaClient } from '@prisma/client';

import { IUserRepository, CreteNewUserInput } from '../interfaces-type';

const prisma = new PrismaClient();

class UserRepository implements IUserRepository {
  constructor() {}

  public async CreateNewUser(data: CreteNewUserInput) {
    await prisma.user.create({
      data: {
        phone: data.phone,
        otp: {
          create: {
            code: data.otpCode,
            expiration: data.expiration,
          },
        },
      },
    });
  }

  public async FindUserByPhone(phone: string) {
    return await prisma.user.findUnique({
      where: {
        phone,
      },
    });
  }

  public async FindUserById(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  public FindUserOtoByUserId(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        otp: true,
      },
    });
  }

  public async FindUserOtpByUserPhone(phone: string) {
    return await prisma.user.findUnique({
      where: {
        phone,
      },
      include: {
        otp: true,
      },
    });
  }

  public async UpdateUserStatus(userId: string, status: string) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        account_status: status,
        otp: {
          delete: {
            userId: userId,
          },
        },
      },
    });
  }
}

export default UserRepository;
