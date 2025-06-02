import { Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/common/db/in-memory.db';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistRepository {
  constructor(private readonly db: InMemoryDB) {}

  async findAll() {
    return await this.db.findAll('artists');
  }

  async findById(id: string) {
    return await this.db.findOne('artists', id);
  }

  async create(artist: Omit<Artist, 'id'>) {
    return await this.db.create('artists', artist);
  }

  async update(id: string, artist: Omit<Artist, 'id'>) {
    return await this.db.update('artists', id, artist);
  }

  async remove(id: string) {
    return await this.db.remove('artists', id);
  }
}
