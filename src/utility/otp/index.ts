import crypto from 'crypto';

export const generateOtp = () => {
  const randomBytes = crypto.randomBytes(3);
  const otp = randomBytes.readUIntBE(0, 3).toString().padStart(6, '0');
  return otp;
};

export const expiationDate = (value: number) => {
  const currentDate = new Date().getTime();
  const expiration = currentDate + value * 1000;
  return new Date(expiration).toISOString();
};
