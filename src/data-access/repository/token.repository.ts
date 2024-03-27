import { PrismaClient } from '@prisma/client';

import { CreateTokensInput } from '../interfaces-type';

// @ts-ignore
const prisma = new PrismaClient();

class TokenRepository {
  public async CreateTokens(data: CreateTokensInput) {
    const refreshToken = await prisma.refreshToken.create({
      data: {
        token: data.refreshToken,
        expiration_date: data.refreshExpirationDate,
        User: {
          connect: {
            id: data.userId,
          },
        },
      },
    });

    const accessToken = await prisma.accessToken.create({
      data: {
        token: data.accessToken,
        expiration_date: data.accessExpirationDate,
        refreshTokenId: refreshToken.id,
        User: {
          connect: {
            id: data.userId,
          },
        },
        RefreshToken: {
          connect: {
            id: refreshToken.id,
          },
        },
      },
    });

    return {
      refreshToken,
      accessToken,
    };
  }

  public async DeleteTokens(refreshTokenId: string, accessTokenId: string) {
    return await prisma.refreshToken.delete({
      where: {
        id: refreshTokenId,
        accessToken: {
          id: accessTokenId,
        },
      },
    });
  }
}

export { TokenRepository };
