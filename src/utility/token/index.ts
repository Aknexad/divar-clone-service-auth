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

export const validateAccessToken = (token: string): jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

export const expirationDate = (validTime: string) => {
  const currentDate = new Date().getTime();
  const expiration = currentDate + parseInt(validTime);
  return new Date(expiration).toISOString();
};
