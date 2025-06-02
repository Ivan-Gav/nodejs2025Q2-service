import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(@Body() dto: CreateTrackDto) {
    return await this.trackService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param() { id }: IdParamDto) {
    return await this.trackService.findOne(id);
  }

  @Put(':id')
  async update(@Param() { id }: IdParamDto, @Body() dto: CreateTrackDto) {
    return await this.trackService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() { id }: IdParamDto) {
    await this.trackService.remove(id);
  }
}
