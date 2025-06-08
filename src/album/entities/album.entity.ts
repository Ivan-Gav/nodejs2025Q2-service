import { Artist } from './../../artist/entities/artist.entity';
import { Favorites } from './../../favs/entities/fav.entity';
import { Track } from './../../track/entities/track.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';

// export interface Album {
//   id: string; // uuid v4
//   name: string;
//   year: number;
//   artistId: string | null; // refers to Artist
// }

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string;

  @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'SET NULL' })
  artist: Artist;

  @OneToMany(() => Track, (track) => track.albumId, { onDelete: 'SET NULL' })
  tracks: Track[];

  @ManyToMany(() => Favorites, (favorites) => favorites.albums)
  favorites: Favorites[];
}
