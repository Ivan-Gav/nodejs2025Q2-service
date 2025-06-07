// src/artist/artist.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

import { AlbumModule } from 'src/album/album.module';
import { FavsModule } from 'src/favs/favs.module';
import { TrackModule } from 'src/track/track.module';
import { Repository } from 'typeorm';

@Module({
  imports: [
    forwardRef(() => AlbumModule),
    forwardRef(() => FavsModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [ArtistController],
  providers: [Repository, ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
