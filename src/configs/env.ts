import z from 'zod';
import dotEnv from 'dotenv';

import ValidateEnv from './validateEnv';

dotEnv.config();

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  RABBIT_MQ_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  VALID_TIME_ACCESS_TOKEN: z.string(),
  VALID_TIME_REFRESH_TOKEN: z.string(),
  VALID_TIME_OTP: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// SOME_NUMBER: z.string().regex(/^\\d+$/).transform(Number),
// SOME_BOOLEAN: z.enum(["true", "false"]).transform((v) => v === "true"),

const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};

ValidateEnv(getEnvIssues());

export const ENV = envSchema.parse(process.env);
