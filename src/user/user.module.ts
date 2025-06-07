import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { InMemoryDB } from 'src/common/db/in-memory.db';
import { UserRepository } from './user.repository';

@Module({
  controllers: [UserController],
  providers: [InMemoryDB, UserRepository, UserService, PasswordUtils],
})
export class UserModule {}
