import { NextFunction, Response, Request } from 'express';

import { repository } from '../../data-access';
import { appError } from '../../utility';

async function lotInOtp(req: Request, res: Response, next: NextFunction) {
  const userRepository = new repository.userRepository.UserRepository();
  const otpRepository = new repository.otpRepository.OtpRepository();

  try {
    const { phone, code } = req.body;

    const user = await userRepository.FindUserOtpByUserPhone(phone);

    if (!user) {
      throw new appError.AppError(
        appError.namesOfErrors.notFound,
        appError.statusCode.NOT_FOUND,
        'user not found',
        true
      );
    }

    if (!user.otp) {
      throw new appError.AppError(
        appError.namesOfErrors.notFound,
        appError.statusCode.NOT_FOUND,
        'otp not found',
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

    if (user.otp.expiration.getTime() < new Date().getTime()) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'otp expired',
        true
      );
    }

    await otpRepository.deleteOtp(user.otp.id);

    req.userInfo = {
      userId: user.id,
    };

    return next();
  } catch (error) {
    next(error);
  }
}

export { lotInOtp };
