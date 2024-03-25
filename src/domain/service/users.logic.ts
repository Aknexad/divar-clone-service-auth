import { PublishSubscribe } from '@Aknexad/mq-hub';
import { Channel } from 'amqplib';

import { IUerLogics } from '../interfaces-type';
import { appError, otp, token } from '../../utility';
import { repository } from '../../data-access';
import { ENV } from '../../configs';

class UsersLogic implements IUerLogics {
  private userRepository: repository.userRepository.UserRepository;
  private publishSubscribe: PublishSubscribe;

  constructor() {
    this.userRepository = new repository.userRepository.UserRepository();
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

    await this.userRepository.UpdateUserStatus(user.id, 'verified');

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

    return {
      accessToken,
      refreshToken,
    };
  }

  public async logIn(phone: string) {
    return;
  }

  public async logOut(userId: string) {
    return;
  }
}

export { UsersLogic };
