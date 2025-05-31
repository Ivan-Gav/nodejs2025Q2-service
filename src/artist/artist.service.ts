import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import {
  ARTIST_ALREADY_EXISTS,
  ARTIST_NOT_FOUND,
} from 'src/common/errors/error-messages';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistService {
  private artists: Record<string, Artist>;

  constructor() {
    this.artists = {};
  }

  async create(dto: CreateArtistDto) {
    const isExistingArtist = await this.checkIfArtistExists(dto);

    if (isExistingArtist) {
      throw new BadRequestException(ARTIST_ALREADY_EXISTS(dto.name));
    }

    const id = randomUUID();

    const newArtist: Artist = {
      ...dto,
      id,
    };

    this.artists[id] = newArtist;
    return newArtist;
  }

  async findAll() {
    return Object.values(this.artists);
  }

  async findOne(id: string) {
    const artist = this.artists[id];
    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }
    return artist;
  }

  async update(id: string, updateArtistDto: CreateArtistDto) {
    const artist = this.artists[id];
    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }

    this.artists[id] = { ...updateArtistDto, id };
    return this.artists[id];
  }

  async remove(id: string) {
    const artist = this.artists[id];

    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }

    delete this.artists[id];
  }

  private async checkIfArtistExists(dto: CreateArtistDto) {
    const { name } = dto;
    return Object.values(this.artists).some((artist) => artist.name === name);
  }
}
