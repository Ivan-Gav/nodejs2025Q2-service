// src/artist/artist.module.ts
import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './artist.repository';

@Module({
  controllers: [ArtistController],
  providers: [ArtistRepository, ArtistService],
  exports: [ArtistService, ArtistRepository],
})
export class ArtistModule {}
