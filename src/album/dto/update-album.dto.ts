import { IsNotEmpty } from 'class-validator';

export class UpdateAlbumDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  year: number;

  artistId: string | null; // refers to Artist
}
