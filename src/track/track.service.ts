import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TRACK_NOT_FOUND } from 'src/common/messages/error-messages';
import { Track } from './entities/track.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly repository: Repository<Track>,
  ) {}

  async create(dto: CreateTrackDto) {
    return await this.repository.save(dto);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const track = await this.repository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException(TRACK_NOT_FOUND(id));
    }
    return track;
  }

  async findMany(ids: string[]) {
    if (!ids.length) {
      return [] as Track[];
    }

    return await this.repository.find({
      where: { id: In(ids) },
    });
  }

  async update(id: string, dto: CreateTrackDto) {
    const track = await this.repository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException(TRACK_NOT_FOUND(id));
    }

    const updatedTrack = { ...track, ...dto };

    await this.repository.save(updatedTrack);

    return updatedTrack;
  }

  async remove(id: string) {
    const track = await this.repository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException(TRACK_NOT_FOUND(id));
    }

    await this.repository.remove(track);
  }
}
