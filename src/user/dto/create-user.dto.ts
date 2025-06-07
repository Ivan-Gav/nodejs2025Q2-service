import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}

// export class CreateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   @Length(3, 20)
//   @Matches(/^[a-zA-Z0-9_]+$/, {
//     message: 'Login must contain only letters, numbers and underscores',
//   })
//   login: string;

//   @IsString()
//   @IsNotEmpty()
//   @Length(6, 32)
//   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
//     message:
//       'Password must contain at least one uppercase letter, one lowercase letter and one number',
//   })
//   password: string;
// }
