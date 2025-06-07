import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
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
  @PrimaryColumn({ default: 'default' })
  id: string = 'default';

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable()
  tracks: Track[];
}
