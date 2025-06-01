import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import {
  ALBUM_ADDED_TO_FAVS,
  ARTIST_ADDED_TO_FAVS,
  TRACK_ADDED_TO_FAVS,
} from 'src/common/messages/info-mesages';

@Controller('favs')
export class FavsController {
  constructor(private readonly favoritesService: FavsService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('artist/:id')
  async addTArtist(@Param() { id }: IdParamDto) {
    await this.favoritesService.update('artists', id);
    return { message: ARTIST_ADDED_TO_FAVS(id) };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param() { id }: IdParamDto) {
    await this.favoritesService.remove('artists', id);
  }

  @Post('album/:id')
  async addAlbum(@Param() { id }: IdParamDto) {
    await this.favoritesService.update('albums', id);
    return { message: ALBUM_ADDED_TO_FAVS(id) };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param() { id }: IdParamDto) {
    await this.favoritesService.remove('albums', id);
  }

  @Post('track/:id')
  async addTrack(@Param() { id }: IdParamDto) {
    await this.favoritesService.update('tracks', id);
    return { message: TRACK_ADDED_TO_FAVS(id) };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param() { id }: IdParamDto) {
    await this.favoritesService.remove('tracks', id);
  }
}
