import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { genSalt, hash } from 'bcrypt';
import { User, CreateUserDto } from './user.interface';

@Injectable()
export class UserService {
  private users: Record<string, User>;

  constructor() {
    this.users = {};
  }

  async getAllUsers() {
    return this.users; // TODO remove ids
  }

  async getUserByID(userId: string) {
    return this.users[userId]; // TODO remove ids
  }

  async createUser(dto: CreateUserDto) {
    const isExistingUser = await this.checkIfUserExists(dto);

    if (isExistingUser) {
      throw new HttpException(
        'This login is already used',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { login, password } = dto;

    const id = randomUUID();

    const cryptedPassword = await this.hashPassword(password);
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
    return newUser; // TODO: remove id
  }

  async deleteUserById(userId: string) {
    const entry = this.users[userId];

    if (entry) {
      delete this.users[userId];
      return true;
    }

    return false;
  }

  private async checkIfUserExists(dto: CreateUserDto) {
    const { login } = dto;
    return Object.values(this.users).some((user) => user.login === login);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(process.env.CRYPT_SALT || 10);
    const salt = await genSalt(saltRounds);
    return await hash(password, salt);
  }
}
