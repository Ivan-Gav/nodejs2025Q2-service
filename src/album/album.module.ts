import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './album.repository';

import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [ArtistModule],
  controllers: [AlbumController],
  providers: [AlbumRepository, AlbumService],
})
export class AlbumModule {}
