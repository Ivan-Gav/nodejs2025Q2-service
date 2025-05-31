import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import {
  ARTIST_ALREADY_EXISTS,
  ARTIST_NOT_FOUND,
} from 'src/common/errors/error-messages';
import { ArtistRepository } from './artist.repository';

@Injectable()
export class ArtistService {
  constructor(private readonly repository: ArtistRepository) {}

  async create(dto: CreateArtistDto) {
    const isExistingArtist = await this.checkIfArtistExists(dto);

    if (isExistingArtist) {
      throw new BadRequestException(ARTIST_ALREADY_EXISTS(dto.name));
    }

    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: string) {
    const artist = await this.repository.findById(id);
    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }
    return artist;
  }

  async update(id: string, updateArtistDto: CreateArtistDto) {
    const artist = await this.repository.update(id, updateArtistDto);
    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }
    return artist;
  }

  async remove(id: string) {
    const artist = await this.repository.remove(id);

    if (artist === 0 || !artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }
  }

  private async checkIfArtistExists(dto: CreateArtistDto) {
    const { name } = dto;
    const all = await this.repository.findAll();
    return all.some((artist) => artist.name === name);
  }
}
