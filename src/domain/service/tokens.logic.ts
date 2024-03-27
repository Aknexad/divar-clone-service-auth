// import { Channel } from 'amqplib';

import { token } from '../../utility';
import { repository } from '../../data-access';
import { ENV } from '../../configs';

class TokensLogic {
  //   private userRepository: repository.userRepository.UserRepository;
  //   private otpRepository: repository.otpRepository.OtpRepository;
  private tokenRepository: repository.tokenRepository.TokenRepository;
  //   private publishSubscribe: PublishSubscribe;

  constructor() {
    // this.userRepository = new repository.userRepository.UserRepository();
    // this.otpRepository = new repository.otpRepository.OtpRepository();
    this.tokenRepository = new repository.tokenRepository.TokenRepository();
    // this.publishSubscribe = new PublishSubscribe();
  }

  public async CreateTokens(userId: string) {
    const accessToken = token.generateAccessToken(
      { userId },
      ENV.VALID_TIME_ACCESS_TOKEN
    );
    const refreshToken = token.generateRefreshToken({}, ENV.VALID_TIME_REFRESH_TOKEN);
    const accessExpirationDate = token.expirationDate(ENV.VALID_TIME_ACCESS_TOKEN);
    const refreshExpirationDate = token.expirationDate(ENV.VALID_TIME_REFRESH_TOKEN);

    await this.tokenRepository.CreateTokens({
      accessToken,
      refreshToken,
      accessExpirationDate,
      refreshExpirationDate,
      userId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export { TokensLogic };
