import { PrismaClient } from '@prisma/client';

import { CreateTokensInput } from '../interfaces-type';

const prisma = new PrismaClient();

class TokenRepository {
  public async CreateTokens(data: CreateTokensInput) {}
}

export { TokenRepository };
