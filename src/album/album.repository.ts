import { Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/common/db/in-memory.db';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumRepository {
  constructor(private readonly db: InMemoryDB) {}

  async findAll() {
    return await this.db.findAll('albums');
  }

  async findById(id: string) {
    return await this.db.findOne('albums', id);
  }

  async create(album: Omit<Album, 'id'>) {
    return await this.db.create('albums', album);
  }

  async update(id: string, album: Omit<Album, 'id'>) {
    return await this.db.update('albums', id, album);
  }

  async remove(id: string) {
    return await this.db.remove('albums', id);
  }
}
