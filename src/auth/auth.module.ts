import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME || '15m' },
    }),
    UserModule,
    LoggingModule,
  ],
  providers: [AuthService, PasswordUtils],
  controllers: [AuthController],
})
export class AuthModule {}
