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

  @Get('api/users')
  // Protect endpoint using guard with JWT validation
  @UseGuards(new AuthGuard())
  // accessing to user context using @User decorator
  showUsers(@User('username') user) {
    this.logger.warn(`Username: ${user}`);
    return this.userService.showUsers().then(data => {
      this.logger.warn(`got data from service: ${JSON.stringify(data)}`);
      return data;
    });
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
