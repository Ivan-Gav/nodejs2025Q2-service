import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumRepository } from './album.repository';
import {
  ALBUM_ALREADY_EXISTS,
  ALBUM_NOT_FOUND,
  ARTIST_NOT_FOUND,
} from 'src/common/errors/error-messages';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistRepository } from 'src/artist/artist.repository';

@Injectable()
export class AlbumService {
  constructor(
    private readonly repository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async create(dto: CreateAlbumDto) {
    const [isExistingAlbum, isExistingArtist] = await Promise.all([
      this.checkIfAlbumExists(dto),
      this.checkIfArtistExists(dto),
    ]);

    if (!isExistingArtist) {
      throw new BadRequestException(ARTIST_NOT_FOUND(dto.artistId));
    }

    if (isExistingAlbum) {
      throw new BadRequestException(ALBUM_ALREADY_EXISTS(dto.name));
    }

    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: string) {
    const album = await this.repository.findById(id);
    if (!album) {
      throw new NotFoundException(ALBUM_NOT_FOUND(id));
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.repository.update(id, updateAlbumDto);
    if (!album) {
      throw new NotFoundException(ALBUM_NOT_FOUND(id));
    }
    return album;
  }

  async remove(id: string) {
    const album = await this.repository.remove(id);

    if (album === 0 || !album) {
      throw new NotFoundException(ALBUM_NOT_FOUND(id));
    }
  }

  private async checkIfAlbumExists(dto: CreateAlbumDto) {
    const { name, artistId } = dto;
    const all = await this.repository.findAll();
    return all.some(
      (album) => album.name === name && album.artistId === artistId,
    );
  }

  private async checkIfArtistExists(dto: CreateAlbumDto) {
    const { artistId } = dto;
    if (artistId === null) {
      return true;
    }
    const artist = await this.artistRepository.findById(artistId);
    return !!artist;
  }
}
