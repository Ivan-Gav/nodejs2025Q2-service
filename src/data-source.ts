import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { Artist } from './artist/entities/artist.entity';
import { Album } from './album/entities/album.entity';
import { Track } from './track/entities/track.entity';
import { Favorites } from './favs/entities/fav.entity';
import { User } from './user/entities/user.entity';
import { SchemaUpdate1749364777312 } from './migrations/1749364777312-SchemaUpdate';

const config: DataSourceOptions & { cli?: { migrationsDir: string } } = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Artist, Album, Track, Favorites, User],
  // migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  migrations: [SchemaUpdate1749364777312],
  synchronize: false,
  logging: true,
  cli: {
    migrationsDir: path.join(__dirname, '../migrations'),
  },
};

const AppDataSource = new DataSource(config);

export default AppDataSource;
