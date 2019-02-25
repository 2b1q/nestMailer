import {
  Body,
  Controller,
  Delete,
  Get,
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
  private logData = ({ user, data }: any, operation: string) => {
    operation &&
      user &&
      data &&
      this.logger.log(
        `${operation} User: "${user}" DATA: ${JSON.stringify(data)}`,
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
  add(@Body() data: MailDTO, @User('username') user) {
    // dispatch username from JWT using @User('username') decorator and pass it to mailService.add()
    this.logData({ user, data }, 'CREATE MAIL');
    return this.mailService.add(user, data);
  }

  // UPDATE mail by ID endpoint
  @Put(':id')
  @UsePipes(new ValidationPipe())
  // update partial (not all required fields)
  update(@Param('id') id, @Body() data: Partial<MailDTO>) {
    // log UPDATE data
    this.logger.log(`Update email id ${id} by data: ${JSON.stringify(data)}`);
    return this.mailService.update(id, data);
  }

  // DELETE mail FROM DB by ID endpoint
  @Delete(':id')
  deleteMail(@Param('id') id) {
    return this.mailService.delete(id);
  }
}
