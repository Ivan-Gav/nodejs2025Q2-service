import { Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/common/db/in-memory.db';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackRepository {
  constructor(private readonly db: InMemoryDB) {}

  async findAll() {
    return await this.db.findAll('tracks');
  }

  async findById(id: string) {
    return await this.db.findOne('tracks', id);
  }

  async create(track: Omit<Track, 'id'>) {
    return await this.db.create('tracks', track);
  }

  async update(id: string, track: Omit<Track, 'id'>) {
    return await this.db.update('tracks', id, track);
  }

  async remove(id: string) {
    return await this.db.remove('tracks', id);
  }
}
