import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

// import { FavsRepository } from './favs.repository';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { Favorites } from './entities/fav.entity';
import { UNPROCESSABLE_ENTITY } from 'src/common/messages/error-messages';
import { Repository } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';

// TODO move out
type TFavoritesType = 'artists' | 'albums' | 'tracks';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(Favorites)
    private readonly repository: Repository<Favorites>,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async findAll() {
    return await this.repository.findOneBy({ id: 'default' });

    // return {
    //   artists: await this.artistService.findMany(favorites.artists),
    //   albums: await this.albumService.findMany(favorites.albums),
    //   tracks: await this.trackService.findMany(favorites.tracks),
    // };
  }

  async update(type: TFavoritesType, id: string) {
    try {
      const favorites = await this.repository.findOneBy({ id: 'default' });
      const entity = await this.findEntity(type, id);

      switch (type) {
        case 'artists':
          if (!favorites.artists.some((a) => a.id === entity.id)) {
            favorites.artists = [
              ...(favorites.artists || []),
              entity as Artist,
            ];
          }
          break;

        case 'albums':
          if (!favorites.albums.some((a) => a.id === entity.id)) {
            favorites.albums = [...(favorites.albums || []), entity as Album];
          }
          break;

        case 'tracks':
          if (!favorites.tracks.some((a) => a.id === entity.id)) {
            favorites.tracks = [...(favorites.tracks || []), entity as Track];
          }
          break;

        default:
          break;
      }
      await this.repository.save(favorites);
      return favorites;
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Transform 404 to 422 for favorites
        throw new UnprocessableEntityException(UNPROCESSABLE_ENTITY(type, id));
      }
      throw error;
    }
  }

  async remove(type: TFavoritesType, id: string) {
    // await this.throwErrorIfNotExists(type, id);
    try {
      const favorites = await this.repository.findOneBy({ id: 'default' });
      const entity = await this.findEntity(type, id);

      (favorites[type] as Array<typeof entity>) = favorites[type].filter(
        (entity) => entity.id !== id,
      ) as Array<typeof entity>;

      await this.repository.save(favorites);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Transform 404 to 422 for favorites
        throw new UnprocessableEntityException(UNPROCESSABLE_ENTITY(type, id));
      }
      throw error;
    }
    // return this.repository.remove(type, id);
  }

  private async findEntity(type: TFavoritesType, id: string) {
    switch (type) {
      case 'artists':
        return await this.artistService.findOne(id);
      case 'albums':
        return this.albumService.findOne(id);
      case 'tracks':
        return await this.trackService.findOne(id);
      default:
        throw new NotFoundException();
    }
  }

  // private async checkIfExists(type: TFavoritesType, id: string) {
  //   switch (type) {
  //     case 'artists':
  //       await this.artistService.findOne(id);
  //       return true;
  //     case 'albums':
  //       await this.albumService.findOne(id);
  //       return true;
  //     case 'tracks':
  //       await this.trackService.findOne(id);
  //       return true;
  //     default:
  //       return false;
  //   }
  // }

  // private async throwErrorIfNotExists(type: TFavoritesType, id: string) {
  //   try {
  //     await this.checkIfExists(type, id);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       // Transform 404 to 422 for favorites
  //       throw new UnprocessableEntityException(UNPROCESSABLE_ENTITY(type, id));
  //     }
  //   }
  // }
}
