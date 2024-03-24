import { IUerLogics } from '../interfaces-type';
import { IUserRepository } from '../../data-access/interfaces-type';
import { appError, otp } from '../../utility';

class UsersLogic implements IUerLogics {
  private userRepoInstance: IUserRepository;

  constructor(UserRepo: new () => IUserRepository) {
    this.userRepoInstance = new UserRepo();
  }

  public async Registering(phone: string) {
    const checkPhoneNumber = await this.userRepoInstance.FindUserByPhone(phone);

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

    await this.userRepoInstance.CreateNewUser({
      phone,
      otpCode,
      expiration: otpExcretionTime,
    });

    // send otp

    return;
  }

  public async verifyOtp(phone: string, otpCode: string) {
    const user = await this.userRepoInstance.FindUserOtpByUserPhone(phone);

    if (!user) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'user not found',
        true
      );
    }

    if (!user.opt) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'otp not found',
        true
      );
    }

    if (user.opt.code !== otpCode) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'invalid otp',
        true
      );
    }

    if (user.opt.expiration.getTime() < new Date().getTime()) {
      throw new appError.AppError(
        appError.namesOfErrors.badRequest,
        appError.statusCode.BAD_REQUEST,
        'otp expired',
        true
      );
    }

    await this.userRepoInstance.UpdateUserStatus(user.id, 'verified');

    // create access and refresh token

    return;
  }

  public async logIn(phone: string) {
    return;
  }

  public async logOut(userId: string) {
    return;
  }
}

export default UsersLogic;
