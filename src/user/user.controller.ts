import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  showUsers() {
    return this.userService.showUsers();
  }

  @Post('login')
  @UsePipes(new ValidationPipe()) // Use ValidationPipe from '@nestjs/common'
  login(@Body() data: UserDto) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe()) // Use ValidationPipe from '@nestjs/common'
  register(@Body() data: UserDto) {
    return this.userService.register(data);
  }
}
