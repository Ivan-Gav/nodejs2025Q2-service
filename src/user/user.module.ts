import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordUtils } from 'src/common/utils/password.utils';

@Module({
  controllers: [UserController],
  providers: [UserService, PasswordUtils],
})
export class UserModule {}
