// src/core/database/in-memory.db.ts
import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Favorites } from 'src/favs/entities/fav.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

type EntityMap = {
  artists: Artist;
  tracks: Track;
  users: User;
  albums: Album;
};

type Data = {
  entities: { [K in keyof EntityMap]: Map<string, EntityMap[K]> };
  favorites: Favorites;
};

@Injectable()
export class InMemoryDB {
  private data: Data = {
    entities: {
      artists: new Map<string, Artist>(),
      tracks: new Map<string, Track>(),
      users: new Map<string, User>(),
      albums: new Map<string, Album>(),
    },
    favorites: {
      artists: new Set<string>(),
      albums: new Set<string>(),
      tracks: new Set<string>(),
    },
  };

  async create<K extends keyof EntityMap>(
    entityType: K,
    entity: Omit<EntityMap[K], 'id'>,
  ): Promise<EntityMap[K]> {
    const id = crypto.randomUUID();
    const record = { ...entity, id } as EntityMap[K];
    this.data.entities[entityType].set(id, record);
    return record;
  }

  async findOne<K extends keyof EntityMap>(
    entityType: K,
    id: string,
  ): Promise<EntityMap[K] | undefined> {
    return this.data.entities[entityType].get(id);
  }

  async findAll<K extends keyof EntityMap>(
    entityType: K,
  ): Promise<EntityMap[K][]> {
    return Array.from(this.data.entities[entityType].values());
  }

  async update<K extends keyof EntityMap>(
    entityType: K,
    id: string,
    entity: Omit<EntityMap[K], 'id'>,
  ): Promise<EntityMap[K] | null> {
    const record = this.data.entities[entityType].get(id);
    if (record) {
      const updatedRecord = { ...entity, id } as EntityMap[K];
      this.data.entities[entityType].set(id, updatedRecord);
      return updatedRecord;
    }
    return null;
  }

  async remove<K extends keyof EntityMap>(
    entityType: K,
    id: string,
  ): Promise<number> {
    const success = this.data.entities[entityType].delete(id);
    return success ? 1 : 0;
  }

  favorites = {
    add: async <K extends keyof Favorites>(type: K, id: string) =>
      Array.from(this.data.favorites[type].add(id)),
    remove: async <K extends keyof Favorites>(type: K, id: string) =>
      this.data.favorites[type].delete(id),
    has: async <K extends keyof Favorites>(type: K, id: string) =>
      this.data.favorites[type].has(id),
    getAll: async () => ({
      artists: Array.from(this.data.favorites.artists),
      albums: Array.from(this.data.favorites.albums),
      tracks: Array.from(this.data.favorites.tracks),
    }),
  };
}
