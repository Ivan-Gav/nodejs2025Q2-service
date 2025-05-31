import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User, CreateUserDto, UpdatePasswordDto } from './entities/user.entity';
import {
  LOGIN_ALREADY_USED,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
} from 'src/common/errors/error-messages';
import { PasswordUtils } from 'src/common/utils/password.utils';

@Injectable()
export class UserService {
  private users: Record<string, User>;

  constructor(private readonly passwordUtils: PasswordUtils) {
    this.users = {};
  }

  async getAllUsers() {
    return Object.values(this.users);
  }

  async getUserByID(userId: string) {
    const user = this.users[userId];
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND(userId));
    }
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const isExistingUser = await this.checkIfUserExists(dto);

    const { login, password } = dto;

    if (isExistingUser) {
      throw new BadRequestException(LOGIN_ALREADY_USED(login));
    }

    const id = randomUUID();

    const cryptedPassword = await this.passwordUtils.hashPassword(password);
    const currentTimestamp = Date.now();

    const newUser: User = {
      id,
      login,
      password: cryptedPassword,
      version: 1,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    this.users[id] = newUser;
    return newUser;
  }

  async updateUserPasswordById(
    userId: string,
    newPasswordDto: UpdatePasswordDto,
  ) {
    const user = this.users[userId];
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND(userId));
    }

    const { oldPassword, newPassword } = newPasswordDto;

    const isOldPasswordCorrect = await this.passwordUtils.comparePassword(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      throw new ForbiddenException(WRONG_PASSWORD(oldPassword));
    }

    const cryptedNewPassword =
      await this.passwordUtils.hashPassword(newPassword);
    const currentTimestamp = Date.now();

    const updatedUser: User = {
      ...user,
      password: cryptedNewPassword,
      version: user.version + 1,
      updatedAt: currentTimestamp,
    };
    this.users[userId] = updatedUser;
    return updatedUser;
  }

  async deleteUserById(userId: string) {
    const user = this.users[userId];

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND(userId));
    }

    delete this.users[userId];
  }

  private async checkIfUserExists(dto: CreateUserDto) {
    const { login } = dto;
    return Object.values(this.users).some((user) => user.login === login);
  }
}
