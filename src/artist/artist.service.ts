import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ARTIST_NOT_FOUND } from 'src/common/messages/error-messages';
import { Artist } from './entities/artist.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly repository: Repository<Artist>,
  ) {}

  async create(dto: CreateArtistDto) {
    return await this.repository.save(dto);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const artist = await this.repository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }
    return artist;
  }

  async findMany(ids: string[]) {
    if (!ids.length) {
      return [] as Artist[];
    }

    return await this.repository.find({
      where: { id: In(ids) },
    });
  }

  async update(id: string, updateArtistDto: CreateArtistDto) {
    const artist = await this.repository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }

    const updatedArtist = { ...artist, ...updateArtistDto };

    await this.repository.save(updatedArtist);

    return updatedArtist;
  }

  async remove(id: string) {
    const artist = await this.repository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }

    await this.repository.remove(artist);
  }
}
