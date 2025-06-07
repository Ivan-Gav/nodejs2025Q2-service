import {
  // BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, CreateUserDto, UpdatePasswordDto } from './entities/user.entity';
import {
  // LOGIN_ALREADY_USED,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
} from 'src/common/messages/error-messages';
import { PasswordUtils } from 'src/common/utils/password.utils';
// import { UserRepository } from './user.repository';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly passwordUtils: PasswordUtils,
    private readonly repository: Repository<User>,
  ) {}

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND(id));
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    // const isExistingUser = await this.checkIfUserExists(dto);

    const { login, password } = dto;

    // if (isExistingUser) {
    //   throw new BadRequestException(LOGIN_ALREADY_USED(login));
    // }

    const cryptedPassword = await this.passwordUtils.hashPassword(password);

    const newUser = {
      login,
      password: cryptedPassword,
    };

    return await this.repository.save(newUser);
  }

  async updateUserPasswordById(id: string, newPasswordDto: UpdatePasswordDto) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND(id));
    }

    const { oldPassword, newPassword } = newPasswordDto;

    const isOldPasswordCorrect = await this.passwordUtils.comparePassword(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      throw new ForbiddenException(WRONG_PASSWORD());
    }

    const cryptedNewPassword =
      await this.passwordUtils.hashPassword(newPassword);

    user.password = cryptedNewPassword;

    return await this.repository.save(user);
  }

  async deleteUserById(id: string) {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND(id));
    }
    await this.repository.remove(user);
  }

  // private async checkIfUserExists(dto: CreateUserDto) {
  //   const { login } = dto;
  //   const all = await this.repository.findAll();
  //   return all.some((user) => user.login === login);
  // }
}
