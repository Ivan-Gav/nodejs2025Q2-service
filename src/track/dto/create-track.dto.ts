import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf((value) => value === null || typeof value === 'string')
  artistId: string | null; // refers to Artist

  @ValidateIf((value) => value === null || typeof value === 'string')
  albumId: string | null; // refers to Album

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duration: number;
}
