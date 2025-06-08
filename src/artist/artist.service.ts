import {
  // BadRequestException,
  // forwardRef,
  // Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import {
  // ARTIST_ALREADY_EXISTS,
  ARTIST_NOT_FOUND,
} from 'src/common/messages/error-messages';
// import { ArtistRepository } from './artist.repository';
import { Artist } from './entities/artist.entity';
// import { AlbumService } from 'src/album/album.service';
// import { FavsService } from 'src/favs/favs.service';
// import { TrackService } from 'src/track/track.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorites } from 'src/favs/entities/fav.entity';

@Injectable()
export class ArtistService {
  constructor(
    // @Inject(forwardRef(() => AlbumService))
    // private readonly albumService: AlbumService,
    // @Inject(forwardRef(() => FavsService))
    // private readonly favsService: FavsService,
    // @Inject(forwardRef(() => TrackService))
    // private readonly tracksService: TrackService,
    @InjectRepository(Artist)
    private readonly repository: Repository<Artist>,
    @InjectRepository(Favorites)
    private readonly favorites: Repository<Favorites>,
  ) {}

  async create(dto: CreateArtistDto) {
    // const isExistingArtist = await this.checkIfArtistExists(dto);

    // if (isExistingArtist) {
    //   throw new BadRequestException(ARTIST_ALREADY_EXISTS(dto.name));
    // }

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
    // await Promise.all([
    //   this.albumService.eraseArtist(id),
    //   this.tracksService.eraseArtist(id),
    //   this.favsService.remove('artists', id),
    // ]);

    const artist = await this.repository.findOneBy({ id });

    console.log('artist to remove => ', artist);

    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND(id));
    }

    if (artist.favorites) {
      console.log('artist.favorites = ', artist.favorites);
      artist.favorites = null;
      console.log('artist.favorites nullified = ', artist);

      await this.repository.save(artist);
      console.log('nullified fav artist successfully saved');
    }

    await this.repository.remove(artist);
  }

  // private async checkIfArtistExists(dto: CreateArtistDto) {
  //   const { name } = dto;
  //   const all = await this.repository.findAll();
  //   return all.some((artist) => artist.name === name);
  // }
}
