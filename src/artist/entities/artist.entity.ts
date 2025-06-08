import { Album } from './../../album/entities/album.entity';
import { Favorites } from './../../favs/entities/fav.entity';
import { Track } from './../../track/entities/track.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';

// export interface Artist {
//   id: string; // uuid v4
//   name: string;
//   grammy: boolean;
// }

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist, { onDelete: 'SET NULL' })
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist, { onDelete: 'SET NULL' })
  tracks: Track[];

  @ManyToMany(() => Favorites, (favorites) => favorites.artists, {
    cascade: ['remove'],
  })
  favorites: Favorites;
}
