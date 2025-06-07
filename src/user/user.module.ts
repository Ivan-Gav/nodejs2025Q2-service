import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { Repository } from 'typeorm';

@Module({
  controllers: [UserController],
  providers: [Repository, UserService, PasswordUtils],
})
export class UserModule {}
