import { PublishSubscribe } from '@Aknexad/mq-hub';
import { Channel } from 'amqplib';

import { IUerLogics } from '../interfaces-type';
import { appError, otp, token } from '../../utility';
import { repository } from '../../data-access';
import { ENV } from '../../configs';

class UsersLogic implements IUerLogics {
  private userRepository: repository.userRepository.UserRepository;
  private tokenRepository: repository.tokenRepository.TokenRepository;
  private publishSubscribe: PublishSubscribe;

  constructor() {
    this.userRepository = new repository.userRepository.UserRepository();
    this.tokenRepository = new repository.tokenRepository.TokenRepository();
    this.publishSubscribe = new PublishSubscribe();
  }

  public async Registering(phone: string, channel: Channel) {
    const checkPhoneNumber = await this.userRepository.FindUserByPhone(phone);

    if (checkPhoneNumber && checkPhoneNumber.account_status === 'verified') {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'user already exist',
        true
      );
    }

    const otpCode = otp.generateOtp();
    const otpExcretionTime = otp.expiationDate(120);

    const user = await this.userRepository.CreateNewUser({
      phone,
      otpCode,
      expiration: otpExcretionTime,
    });

    // send otp
    await this.publishSubscribe.PublishMassage({
      channel,
      exchangeName: 'notifications',
      bindingKey: 'notifications.send.otp',
      massage: {
        userId: user.id,
        code: otpCode,
      },
    });

    return {};
  }

  public async logIn(phone: string, code: string) {
    const user = await this.userRepository.FindUserOtpByUserPhone(phone);

    if (!user)
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'user not found',
        true
      );

    if (!user.otp) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'user not found',
        true
      );
    }

    if (user.otp.expiration < new Date()) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'otp expired',
        true
      );
    }

    if (user.otp.code !== code) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'invalid otp',
        true
      );
    }

    // create access and refresh token

    const accessToken = token.generateAccessToken(
      {
        userId: user.id,
      },
      ENV.VALID_TIME_ACCESS_TOKEN
    );

    const refreshToken = token.generateRefreshToken(
      {
        userId: user.id,
      },
      ENV.VALID_TIME_REFRESH_TOKEN
    );

    // create token record in db

    this.tokenRepository.CreateTokens({
      accessToken,
      accessExpirationDate: token.expirationDate(ENV.VALID_TIME_ACCESS_TOKEN),
      refreshToken,
      refreshExpirationDate: token.expirationDate(ENV.VALID_TIME_REFRESH_TOKEN),
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async logOut(userId: string) {
    return;
  }
}

export { UsersLogic };
