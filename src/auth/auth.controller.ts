import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from './decorators/public.decorator';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password.interceptor';
import { TimestampInterceptor } from 'src/interceptors/timestamp.interceptor';

@UseInterceptors(RemovePasswordInterceptor)
@UseInterceptors(TimestampInterceptor)
@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
    // return { message: 'User created successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.login,
      loginDto.password,
    );
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    if (
      !refreshTokenDto.refreshToken ||
      typeof refreshTokenDto.refreshToken !== 'string'
    ) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      return await this.authService.refreshToken(refreshTokenDto.refreshToken);
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
