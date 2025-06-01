import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { FavsRepository } from './favs.repository';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { Favorites } from './entities/fav.entity';
import { UNPROCESSABLE_ENTITY } from 'src/common/messages/error-messages';

@Injectable()
export class FavsService {
  constructor(
    private readonly repository: FavsRepository,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll() {
    const favorites = await this.repository.findAll();

    return {
      artists: await this.artistService.findMany(favorites.artists),
      albums: await this.albumService.findMany(favorites.albums),
      tracks: await this.trackService.findMany(favorites.tracks),
    };
  }

  async update(type: keyof Favorites, id: string) {
    await this.throwErrorIfNotExists(type, id);
    return this.repository.update(type, id);
  }

  async remove(type: keyof Favorites, id: string) {
    await this.throwErrorIfNotExists(type, id);
    return this.repository.remove(type, id);
  }

  private async checkIfExists(type: keyof Favorites, id: string) {
    switch (type) {
      case 'artists':
        await this.artistService.findOne(id);
        return true;
      case 'albums':
        await this.albumService.findOne(id);
        return true;
      case 'tracks':
        await this.trackService.findOne(id);
        return true;
      default:
        return false;
    }
  }

  private async throwErrorIfNotExists(type: keyof Favorites, id: string) {
    try {
      await this.checkIfExists(type, id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Transform 404 to 422 for favorites
        throw new UnprocessableEntityException(UNPROCESSABLE_ENTITY(type, id));
      }
    }
  }
}
