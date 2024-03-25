import jwt from 'jsonwebtoken';
import { ENV } from '../../configs';

export const generateAccessToken = (payload: any, validTime: string) => {
  const accessToken = jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: validTime,
  });
  return accessToken;
};

export const generateRefreshToken = (payload: any, validTime: string) => {
  const refreshToken = jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: validTime,
  });
  return refreshToken;
};
