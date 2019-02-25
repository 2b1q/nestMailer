import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { MailService } from './mail.service';
import { MailDTO } from './mail.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';

/*
 * CRUD mail controller
 * */
@Controller('api/mail')
export class MailController {
  // inject dependencies (MailService) through constructor
  constructor(private readonly mailService: MailService) {}

  // define private logger
  private logger = new Logger('MailController');

  // Log operation and its data
  private logData = ({ userId, username, data }: any, operation: string) => {
    operation &&
      username &&
      userId &&
      data &&
      this.logger.log(
        `${operation} User: "${username}" userId: ${userId} DATA: ${JSON.stringify(
          data,
        )}`,
      );
  };

  // GET ALL mails from DB endpoint
  @Get()
  getAllRecords() {
    return this.mailService.getAll();
  }

  // GET mail FROM DB by ID endpoint
  // http://localhost:3000/mail/12344324
  @Get(':id')
  findOne(@Param('id') id) {
    return this.mailService.get(id);
  }

  // CREATE mail endpoint
  @Post()
  @UseGuards(new AuthGuard()) // JWT AuthGuard
  @UsePipes(new ValidationPipe()) // Data Validation pipe
  add(@Body() data: MailDTO, @User() user: any) {
    // dispatch user object from JWT using @User() decorator and pass it to mailService.add()
    const { username, id: userId } = user;
    this.logData({ username, data, userId }, 'CREATE MAIL');
    return this.mailService.add(userId, data);
  }

  // UPDATE mail by ID endpoint
  @Put(':id')
  @UseGuards(new AuthGuard()) // JWT AuthGuard
  @UsePipes(new ValidationPipe()) // Data Validation pipe
  // update partial (not all required fields)
  update(@Param('id') id, @Body() data: Partial<MailDTO>) {
    // log UPDATE data
    this.logger.log(`Update email id ${id} by data: ${JSON.stringify(data)}`);
    return this.mailService.update(id, data);
  }

  // DELETE mail FROM DB by ID endpoint
  @Delete(':id')
  @UseGuards(new AuthGuard()) // JWT AuthGuard
  async deleteMail(@Param('id') id) {
    const { status, result } = await this.mailService.delete(id);
    if (status !== 200) {
      throw new HttpException(result, status);
    }
    return result;
  }
}
