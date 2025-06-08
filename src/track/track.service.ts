import {
  // BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
// import { TrackRepository } from './track.repository';
import {
  // ALBUM_NOT_FOUND,
  // ARTIST_NOT_FOUND,
  TRACK_NOT_FOUND,
} from 'src/common/messages/error-messages';
import { Track } from './entities/track.entity';
import { ArtistService } from 'src/artist/artist.service';
import { FavsService } from 'src/favs/favs.service';
import { AlbumService } from 'src/album/album.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly repository: Repository<Track>,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  async create(dto: CreateTrackDto) {
    // const [isExistingAlbum, isExistingArtist] = await Promise.all([
    //   this.checkIfAlbumExists(dto),
    //   this.checkIfArtistExists(dto),
    // ]);

    // if (!isExistingArtist) {
    //   throw new BadRequestException(ARTIST_NOT_FOUND(dto.artistId));
    // }

    // if (!isExistingAlbum) {
    //   throw new BadRequestException(ALBUM_NOT_FOUND(dto.name));
    // }

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
    // const [isExistingAlbum, isExistingArtist] = await Promise.all([
    //   this.checkIfAlbumExists(dto),
    //   this.checkIfArtistExists(dto),
    // ]);

    // if (!isExistingArtist) {
    //   throw new BadRequestException(ARTIST_NOT_FOUND(dto.artistId));
    // }

    // if (!isExistingAlbum) {
    //   throw new BadRequestException(ALBUM_NOT_FOUND(dto.name));
    // }

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

  // async eraseArtist(id: string) {
  //   const tracks = await this.repository.findAll();
  //   await Promise.all(
  //     tracks.map((track) => {
  //       if (track.artistId === id) {
  //         const { id, ...rest } = track;
  //         this.repository.update(id, { ...rest, artistId: null });
  //       }
  //     }),
  //   );
  // }

  // async eraseAlbum(id: string) {
  //   const tracks = await this.repository.findAll();
  //   await Promise.all(
  //     tracks.map((track) => {
  //       if (track.albumId === id) {
  //         const { id, ...rest } = track;
  //         this.repository.update(id, { ...rest, albumId: null });
  //       }
  //     }),
  //   );
  // }

  // private async checkIfArtistExists(dto: CreateTrackDto) {
  //   const { artistId } = dto;
  //   if (artistId === null) {
  //     return true;
  //   }
  //   const artist = await this.artistService.findOne(artistId);
  //   return !!artist;
  // }

  // private async checkIfAlbumExists(dto: CreateTrackDto) {
  //   const { albumId } = dto;
  //   if (albumId === null) {
  //     return true;
  //   }
  //   const album = await this.albumService.findOne(albumId);
  //   return !!album;
  // }
}
