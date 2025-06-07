import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './album.repository';

import { ArtistModule } from 'src/artist/artist.module';
import { TrackModule } from 'src/track/track.module';
import { FavsModule } from 'src/favs/favs.module';

@Module({
  imports: [
    forwardRef(() => ArtistModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavsModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumRepository, AlbumService],
  exports: [AlbumRepository, AlbumService],
})
export class AlbumModule {}
