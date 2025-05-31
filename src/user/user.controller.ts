import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password.interceptor';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@UseInterceptors(RemovePasswordInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.getAllUsers();
  }

  @Get('/:id')
  async getById(@Param() { id }: IdParamDto) {
    return await this.userService.getUserByID(id);
  }

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }

  @Put('/:id')
  async updatePassword(
    @Param() { id }: IdParamDto,
    @Body() newPasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.updateUserPasswordById(id, newPasswordDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() { id }: IdParamDto) {
    await this.userService.deleteUserById(id);
  }
}
