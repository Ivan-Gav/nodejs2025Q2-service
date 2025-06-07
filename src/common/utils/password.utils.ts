import { genSalt, hash, compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordUtils {
  private readonly saltRounds = Number(process.env.CRYPT_SALT) || 10;

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.saltRounds);
    return await hash(password, salt);
  }

  async comparePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(plainTextPassword, hashedPassword);
  }
}
