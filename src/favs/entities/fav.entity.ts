import { Album } from './../../album/entities/album.entity';
import { Artist } from './../../artist/entities/artist.entity';
import { Track } from './../../track/entities/track.entity';
import { Entity, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

// export interface Favorites {
//   artists: Set<string>; // ids
//   albums: Set<string>;
//   tracks: Set<string>;
// }

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

// @Entity()
// export class Favorites {
//   @PrimaryColumn()
//   id: string;

//   @ManyToMany(() => Artist, {
//     eager: true,
//   })
//   @JoinTable()
//   artists: Artist[];

//   @ManyToMany(() => Album, { eager: true })
//   @JoinTable()
//   albums: Album[];

//   @ManyToMany(() => Track, { eager: true })
//   @JoinTable()
//   tracks: Track[];
// }
