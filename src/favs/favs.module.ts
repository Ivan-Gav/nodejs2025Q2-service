import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { FavsRepository } from './favs.repository';
// import { ArtistService } from 'src/artist/artist.service';
// import { AlbumService } from 'src/album/album.service';
// import { TrackService } from 'src/track/track.service';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [ArtistModule, AlbumModule, TrackModule],
  controllers: [FavsController],
  providers: [FavsService, FavsRepository],
})
export class FavsModule {}
