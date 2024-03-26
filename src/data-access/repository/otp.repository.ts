import { PrismaClient } from '@prisma/client';

// @ts-ignore
const prisma = new PrismaClient();

class OtpRepository {
  public async createOtp(userId: string, code: string, expirationDate: string) {
    return await prisma.oTP.create({
      data: {
        code,
        expiration: expirationDate,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public async FindOtpByUserId(userId: string) {
    return await prisma.oTP.findFirst({
      where: {
        userId,
      },
    });
  }

  public async FindOtpById(id: string) {
    return await prisma.oTP.findFirst({
      where: {
        id,
      },
    });
  }

  public async UpdateExpiationOtp(id: string, expiration: Date) {
    return await prisma.oTP.update({
      where: {
        id,
      },
      data: {
        expiration,
      },
    });
  }

  public async deleteOtp(id: string) {
    return await prisma.oTP.delete({
      where: {
        id,
      },
    });
  }
}

export { OtpRepository };
