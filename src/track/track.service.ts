import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackRepository } from './track.repository';
import {
  ALBUM_NOT_FOUND,
  ARTIST_NOT_FOUND,
  TRACK_NOT_FOUND,
} from 'src/common/errors/error-messages';
import { AlbumRepository } from 'src/album/album.repository';
import { ArtistRepository } from 'src/artist/artist.repository';

@Injectable()
export class TrackService {
  constructor(
    private readonly repository: TrackRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async create(dto: CreateTrackDto) {
    const [isExistingAlbum, isExistingArtist] = await Promise.all([
      this.checkIfAlbumExists(dto),
      this.checkIfArtistExists(dto),
    ]);

    if (!isExistingArtist) {
      throw new BadRequestException(ARTIST_NOT_FOUND(dto.artistId));
    }

    if (!isExistingAlbum) {
      throw new BadRequestException(ALBUM_NOT_FOUND(dto.name));
    }

    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: string) {
    const track = await this.repository.findById(id);
    if (!track) {
      throw new NotFoundException(TRACK_NOT_FOUND(id));
    }
    return track;
  }

  async update(id: string, dto: CreateTrackDto) {
    const [isExistingAlbum, isExistingArtist] = await Promise.all([
      this.checkIfAlbumExists(dto),
      this.checkIfArtistExists(dto),
    ]);

    if (!isExistingArtist) {
      throw new BadRequestException(ARTIST_NOT_FOUND(dto.artistId));
    }

    if (!isExistingAlbum) {
      throw new BadRequestException(ALBUM_NOT_FOUND(dto.name));
    }

    const track = await this.repository.update(id, dto);
    if (!track) {
      throw new NotFoundException(TRACK_NOT_FOUND(id));
    }

    return track;
  }

  async remove(id: string) {
    const track = await this.repository.remove(id);
    if (!track) {
      throw new NotFoundException(TRACK_NOT_FOUND(id));
    }
  }

  private async checkIfArtistExists(dto: CreateTrackDto) {
    const { artistId } = dto;
    if (artistId === null) {
      return true;
    }
    const artist = await this.artistRepository.findById(artistId);
    return !!artist;
  }

  private async checkIfAlbumExists(dto: CreateTrackDto) {
    const { albumId } = dto;
    if (albumId === null) {
      return true;
    }
    const album = await this.albumRepository.findById(albumId);
    return !!album;
  }
}
