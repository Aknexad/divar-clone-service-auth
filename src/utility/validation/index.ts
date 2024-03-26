import { z } from 'zod';

export const registerUser = z.object({
  body: z.strictObject({
    phone: z
      .string()
      .regex(/^(09|\+98)[0-9]{9}$/)
      .transform(v => v.replace(/^(09|\+98)/, '0')),
  }),
});

export const verifyOtp = z.object({
  body: z.strictObject({
    phone: z
      .string()
      .regex(/^(09|\+98)[0-9]{9}$/)
      .transform(v => v.replace(/^(09|\+98)/, '0')),
    code: z.string().length(6),
  }),
});

export const logIn = z.object({
  body: z.strictObject({
    phone: z
      .string() // The phone number must be a string
      .regex(/^(09|\+98)[0-9]{9}$/) // The phone number must start with "09" or "+98" and be followed by exactly 9 digits
      .transform(v => v.replace(/^(09|\+98)/, '0')), // The phone number must be transformed to remove the "09" or "+98" prefix
    code: z.string().length(6), // The code must be a string of length 6
  }),
});
