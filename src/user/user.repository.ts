import { Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/common/db/in-memory.db';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly db: InMemoryDB) {}

  async findAll() {
    return await this.db.findAll('users');
  }

  async findById(id: string) {
    return await this.db.findOne('users', id);
  }

  async create(User: Omit<User, 'id'>) {
    return await this.db.create('users', User);
  }

  async update(id: string, User: Omit<User, 'id'>) {
    return await this.db.update('users', id, User);
  }

  async remove(id: string) {
    return await this.db.remove('users', id);
  }
}
