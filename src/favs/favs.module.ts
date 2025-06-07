import { Module, forwardRef } from '@nestjs/common';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TrackModule } from 'src/track/track.module';
import { FavsController } from './favs.controller';
import { FavsRepository } from './favs.repository';
import { FavsService } from './favs.service';

@Module({
  imports: [
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [FavsController],
  providers: [FavsRepository, FavsService],
  exports: [FavsService],
})
export class FavsModule {}
