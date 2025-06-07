import { Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/common/db/in-memory.db';
import { Favorites } from './entities/fav.entity';

@Injectable()
export class FavsRepository {
  constructor(private readonly db: InMemoryDB) {}

  async findAll() {
    return await this.db.favorites.getAll();
  }

  async update(type: keyof Favorites, id: string) {
    return await this.db.favorites.add(type, id);
  }

  async remove(type: keyof Favorites, id: string) {
    return await this.db.favorites.remove(type, id);
  }
}
