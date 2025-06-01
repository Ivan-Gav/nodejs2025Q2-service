import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';
import { ArtistRepository } from 'src/artist/artist.repository';
import { AlbumRepository } from 'src/album/album.repository';
import { TrackRepository } from './track.repository';

@Module({
  imports: [ArtistModule, AlbumModule],
  controllers: [TrackController],
  providers: [AlbumRepository, ArtistRepository, TrackService, TrackRepository],
})
export class TrackModule {}
