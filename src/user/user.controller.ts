import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }
}
