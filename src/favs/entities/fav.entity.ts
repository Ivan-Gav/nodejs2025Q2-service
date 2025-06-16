import { Album } from './../../album/entities/album.entity';
import { Artist } from './../../artist/entities/artist.entity';
import { Track } from './../../track/entities/track.entity';
import { Entity, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export type TFavoritesType = 'artists' | 'albums' | 'tracks';

@Entity()
export class Favorites {
  @PrimaryColumn()
  id: string;

  @ManyToMany(() => Artist, (artist) => artist.favorites, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'favorites_artists',
    joinColumn: {
      name: 'favorites_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'artist_id',
      referencedColumnName: 'id',
    },
  })
  artists: Artist[];

  @ManyToMany(() => Album, (album) => album.favorites, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'favorites_albums',
    joinColumn: {
      name: 'favorites_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'album_id',
      referencedColumnName: 'id',
    },
  })
  albums: Album[];

  @ManyToMany(() => Track, (track) => track.favorites, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'favorites_tracks',
    joinColumn: {
      name: 'favorites_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'track_id',
      referencedColumnName: 'id',
    },
  })
  tracks: Track[];
}
