// src/artist/artist.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './artist.repository';
import { AlbumModule } from 'src/album/album.module';
import { FavsModule } from 'src/favs/favs.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [
    forwardRef(() => AlbumModule),
    forwardRef(() => FavsModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistRepository, ArtistService],
  exports: [ArtistService, ArtistRepository],
})
export class ArtistModule {}
