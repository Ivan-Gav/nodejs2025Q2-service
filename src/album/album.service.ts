import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ALBUM_NOT_FOUND } from 'src/common/messages/error-messages';
import { Album } from './entities/album.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly repository: Repository<Album>,
  ) {}

  async create(dto: CreateAlbumDto) {
    return await this.repository.save(dto);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const album = await this.repository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException(ALBUM_NOT_FOUND(id));
    }
    return album;
  }

  async findMany(ids: string[]) {
    if (!ids.length) {
      return [] as Album[];
    }

    return await this.repository.find({
      where: { id: In(ids) },
    });
  }

  async update(id: string, updateAlbumDto: CreateAlbumDto) {
    const album = await this.repository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException(ALBUM_NOT_FOUND(id));
    }

    const updatedAlbum = { ...album, ...updateAlbumDto };

    await this.repository.save(updatedAlbum);

    return updatedAlbum;
  }

  async remove(id: string) {
    const album = await this.repository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException(ALBUM_NOT_FOUND(id));
    }

    await this.repository.remove(album);
  }
}
