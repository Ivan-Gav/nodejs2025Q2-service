// src/artist/artist.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

import { AlbumModule } from 'src/album/album.module';
import { FavsModule } from 'src/favs/favs.module';
import { TrackModule } from 'src/track/track.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Favorites } from 'src/favs/entities/fav.entity';

@Module({
  imports: [
    forwardRef(() => AlbumModule),
    forwardRef(() => FavsModule),
    forwardRef(() => TrackModule),
    TypeOrmModule.forFeature([Artist, Favorites]),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
