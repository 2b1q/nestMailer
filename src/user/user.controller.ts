import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { AuthGuard } from '../shared/auth.guard';
import { User } from './user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  private logger = new Logger('UserController');

  private logData = ({ userId, username, data }: any, operation: string) => {
    userId && this.logger.log(`userId: ${userId} call operation: ${operation}`);
    username &&
      this.logger.log(`username: ${username} call operation: ${operation}`);
    data &&
      userId &&
      this.logger.log(`userId: ${userId} got data: ${JSON.stringify(data)}`);
    data &&
      username &&
      this.logger.log(
        `username: ${username} got data: ${JSON.stringify(data)}`,
      );
  };

  @Get('api/users')
  // Protect endpoint using guard with JWT validation
  @UseGuards(new AuthGuard())
  // accessing to user context using @User decorator
  showUsers(@User('id') userId) {
    this.logData({ userId }, 'showUsers');
    return this.userService.showUsers().then(data => {
      this.logData({ userId, data }, 'showUsers');
      return data;
    });
  }

  @Get('api/user')
  @UseGuards(new AuthGuard())
  getUser(@User('id') userId: string) {
    this.logData({ userId }, 'getUser');
    return this.userService.getUser(userId);
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
