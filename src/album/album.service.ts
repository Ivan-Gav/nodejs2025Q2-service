import {
  // BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumRepository } from './album.repository';
import {
  // ALBUM_ALREADY_EXISTS,
  ALBUM_NOT_FOUND,
  // ARTIST_NOT_FOUND,
} from 'src/common/messages/error-messages';
import { Album } from './entities/album.entity';
import { TrackService } from 'src/track/track.service';
import { FavsService } from 'src/favs/favs.service';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly repository: AlbumRepository,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  async create(dto: CreateAlbumDto) {
    // const [isExistingAlbum, isExistingArtist] = await Promise.all([
    //   this.checkIfAlbumExists(dto),
    //   this.checkIfArtistExists(dto),
    // ]);

    // if (!isExistingArtist) {
    //   throw new BadRequestException(ARTIST_NOT_FOUND(dto.artistId));
    // }

    // if (isExistingAlbum) {
    //   throw new BadRequestException(ALBUM_ALREADY_EXISTS(dto.name));
    // }

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

  async findMany(ids: string[]) {
    if (!ids.length) {
      return [] as Album[];
    }
    const albums = await Promise.all(
      ids.map((id) => this.repository.findById(id)),
    );
    return albums.filter((album): album is Album => album !== undefined);
  }

  async update(id: string, updateAlbumDto: CreateAlbumDto) {
    const album = await this.repository.update(id, updateAlbumDto);
    if (!album) {
      throw new NotFoundException(ALBUM_NOT_FOUND(id));
    }
    return album;
  }

  async remove(id: string) {
    await Promise.all([
      this.trackService.eraseAlbum(id),
      this.favsService.remove('artists', id),
    ]);

    const album = await this.repository.remove(id);

    if (album === 0 || !album) {
      throw new NotFoundException(ALBUM_NOT_FOUND(id));
    }
  }

  async eraseArtist(id: string) {
    const albums = await this.repository.findAll();
    await Promise.all(
      albums.map((album) => {
        if (album.artistId === id) {
          const { id, ...rest } = album;
          this.repository.update(id, { ...rest, artistId: null });
        }
      }),
    );
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
    const artist = await this.artistService.findOne(artistId);
    return !!artist;
  }
}
