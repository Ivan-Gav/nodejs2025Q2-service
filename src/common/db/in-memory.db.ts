// src/core/database/in-memory.db.ts
import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

type EntityMap = {
  artists: Artist;
  tracks: Track;
  users: User;
  albums: Album;
};

@Injectable()
export class InMemoryDB {
  private data: {
    [K in keyof EntityMap]: Map<string, EntityMap[K]>;
  } = {
    artists: new Map<string, Artist>(),
    tracks: new Map<string, Track>(),
    users: new Map<string, User>(),
    albums: new Map<string, Album>(),
  };

  async create<K extends keyof EntityMap>(
    entityType: K,
    entity: Omit<EntityMap[K], 'id'>,
  ): Promise<EntityMap[K]> {
    const id = crypto.randomUUID();
    const record = { ...entity, id } as EntityMap[K];
    this.data[entityType].set(id, record);
    return record;
  }

  async findOne<K extends keyof EntityMap>(
    entityType: K,
    id: string,
  ): Promise<EntityMap[K] | undefined> {
    return this.data[entityType].get(id);
  }

  async findAll<K extends keyof EntityMap>(
    entityType: K,
  ): Promise<EntityMap[K][]> {
    return Array.from(this.data[entityType].values());
  }

  async update<K extends keyof EntityMap>(
    entityType: K,
    id: string,
    entity: Omit<EntityMap[K], 'id'>,
  ): Promise<EntityMap[K] | null> {
    const record = this.data[entityType].get(id);
    if (record) {
      const updatedRecord = { ...entity, id } as EntityMap[K];
      this.data[entityType].set(id, updatedRecord);
      return updatedRecord;
    }
    return null;
  }

  async remove<K extends keyof EntityMap>(
    entityType: K,
    id: string,
  ): Promise<number> {
    const success = this.data[entityType].delete(id);
    return success ? 1 : 0;
  }

  // Example of type-safe relation query
  // findTracksByArtist(artistId: string): Track[] {
  //   return this.findAll('tracks').filter(
  //     (track) => track.artistId === artistId,
  //   );
  // }
}
