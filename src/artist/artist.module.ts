// src/artist/artist.module.ts
import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './artist.repository';
import { InMemoryDB } from 'src/common/db/in-memory.db';

@Module({
  controllers: [ArtistController],
  providers: [InMemoryDB, ArtistRepository, ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
