import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @ValidateIf((value) => value === null || typeof value === 'string')
  artistId: string | null; // refers to Artist
}
