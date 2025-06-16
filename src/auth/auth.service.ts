import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PasswordUtils } from '../common/utils/password.utils';
import { LoggingService } from 'src/logging/logging.service';
import { User } from 'src/user/entities/user.entity';
import { Tokens } from './entities/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordUtils: PasswordUtils,
    private readonly jwtService: JwtService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('AuthService');
  }

  async validateUser(login: string, password: string) {
    const user = await this.userService.findByLogin(login);

    if (!user) {
      this.logger.debug(`No user found for login: ${login}`);
      return null;
    }

    const isValid = await this.passwordUtils.comparePassword(
      password,
      user.password,
    );

    if (!isValid) {
      this.logger.warn(`Invalid password attempt for login: ${login}`);
      return null;
    }

    return isValid ? user : null;
  }

  async login(user: User): Promise<Tokens> {
    const payload = {
      userId: user.id,
      login: user.login,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME || '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '7d',
      }),
    };
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      return this.login({ ...payload, id: payload.userId });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
