import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, CreateUserDto, UpdatePasswordDto } from './entities/user.entity';
import {
  LOGIN_ALREADY_USED,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
} from 'src/common/errors/error-messages';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly passwordUtils: PasswordUtils,
    private readonly repository: UserRepository,
  ) {}

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: string) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND(id));
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const isExistingUser = await this.checkIfUserExists(dto);

    const { login, password } = dto;

    if (isExistingUser) {
      throw new BadRequestException(LOGIN_ALREADY_USED(login));
    }

    const cryptedPassword = await this.passwordUtils.hashPassword(password);
    const currentTimestamp = Date.now();

    const newUser: Omit<User, 'id'> = {
      login,
      password: cryptedPassword,
      version: 1,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    return await this.repository.create(newUser);
  }

  async updateUserPasswordById(id: string, newPasswordDto: UpdatePasswordDto) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND(id));
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

    const updatedUser: Omit<User, 'id'> = {
      ...user,
      password: cryptedNewPassword,
      version: user.version + 1,
      updatedAt: currentTimestamp,
    };

    return await this.repository.update(id, updatedUser);
  }

  async deleteUserById(id: string) {
    const user = await this.repository.remove(id);

    if (user === 0 || !user) {
      throw new NotFoundException(USER_NOT_FOUND(id));
    }
  }

  private async checkIfUserExists(dto: CreateUserDto) {
    const { login } = dto;
    const all = await this.repository.findAll();
    return all.some((user) => user.login === login);
  }
}
