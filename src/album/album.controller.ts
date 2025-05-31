import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.albumService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: IdParamDto, @Body() updateAlbumDto: CreateAlbumDto) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdParamDto) {
    return this.albumService.remove(id);
  }
}
