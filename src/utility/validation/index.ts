import { z } from 'zod';

export const registerUser = z.object({
  phone: z
    .string()
    .regex(/^(09|\+98)[0-9]{9}$/)
    .transform(v => v.replace(/^(09|\+98)/, '0')),
});
