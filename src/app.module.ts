import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { InMemoryDB } from './common/db/in-memory.db';
import { DatabaseModule } from './common/db/in-memory.db.module';

@Module({
  imports: [UserModule, TrackModule, ArtistModule, AlbumModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, InMemoryDB],
})
export class AppModule {}
