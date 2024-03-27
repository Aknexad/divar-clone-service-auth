import { PublishSubscribe } from '@Aknexad/mq-hub';
import { Channel } from 'amqplib';

import { appError, otp, token } from '../../utility';
import { repository } from '../../data-access';
import { ENV } from '../../configs';

class OtpLogic {
  private userRepository: repository.userRepository.UserRepository;
  private otpRepository: repository.otpRepository.OtpRepository;
  private tokenRepository: repository.tokenRepository.TokenRepository;
  private publishSubscribe: PublishSubscribe;

  constructor() {
    this.userRepository = new repository.userRepository.UserRepository();
    this.otpRepository = new repository.otpRepository.OtpRepository();
    this.tokenRepository = new repository.tokenRepository.TokenRepository();
    this.publishSubscribe = new PublishSubscribe();
  }

  public async verifyOtp(phone: string, otpCode: string) {
    const user = await this.userRepository.FindUserOtpByUserPhone(phone);

    if (!user) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'user not found',
        true
      );
    }

    if (!user.otp) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'otp not found',
        true
      );
    }

    if (user.otp.code !== otpCode) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'invalid otp',
        true
      );
    }

    if (user.otp.expiration.getTime() < new Date().getTime()) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'otp expired',
        true
      );
    }

    // update user status and delete otp
    await this.userRepository.UpdateUserStatus(user.id, 'verified');

    // create access and refresh token

    const accessToken = token.generateAccessToken(
      {
        userId: user.id,
      },
      ENV.VALID_TIME_ACCESS_TOKEN
    );

    const refreshToken = token.generateRefreshToken({}, ENV.VALID_TIME_REFRESH_TOKEN);

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

  public async reSendOtp(phone: string, channel: Channel) {
    const user = await this.userRepository.FindUserOtpByUserPhone(phone);

    if (!user) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'user not found',
        true
      );
    }

    if (!user.otp) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'otp not found',
        true
      );
    }

    if (user.otp.expiration.getTime() > new Date().getTime()) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'otp not expired',
        true
      );
    }

    const otpCode = otp.generateOtp();
    const otpExcretionTime = otp.expiationDate(120);

    await this.otpRepository.createOtp(user.id, otpCode, otpExcretionTime);

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

  public async SenOtp(phone: string, channel: Channel) {
    const user = await this.userRepository.FindUserOtpByUserPhone(phone);

    if (!user) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'user not found',
        true
      );
    }

    // Check if user already has an otp and if it is not expired
    if (user.otp) {
      // If otp exists, check if it is still valid
      if (user.otp.expiration >= new Date()) {
        throw new appError.AppError(
          appError.namesOfErrors.badRequest,
          appError.statusCode.BAD_REQUEST,
          'otp already sent',
          true
        );
      }

      // If otp is expired, delete it before generating a new one
      await this.otpRepository.deleteOtp(user.otp.id);
    }
    const otpCode = otp.generateOtp();
    const otpExcretionTime = otp.expiationDate(+ENV.VALID_TIME_OTP);

    await this.otpRepository.createOtp(user.id, otpCode, otpExcretionTime);

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
}

export { OtpLogic };
