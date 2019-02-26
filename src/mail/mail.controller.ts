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

  // pretty log
  private logData = ({ data, userId }: any, operation: string): void => {
    const execOps = `EXEC ${operation} >>>`;
    const returnOps = `RETURN ${operation} <<<`;
    userId &&
      data &&
      this.logger.log(
        `${returnOps} for userId ${userId} ${JSON.stringify(data)}`,
      );
    userId && !data && this.logger.log(`${execOps} userId ${userId}`);
    !userId && !data && this.logger.log(`${execOps}`);
    !userId && data && this.logger.log(`${returnOps} ${JSON.stringify(data)}`);
  };

  // GET ALL mails from DB endpoint
  @Get()
  getAllRecords() {
    this.logData({}, 'getAllRecords');
    return this.mailService.getAll();
  }

  // GET mail FROM DB by ID endpoint
  // http://localhost:3000/mail/12344324
  @Get(':id')
  @UseGuards(new AuthGuard())
  findOne(@Param('id') id, @User('id') userId) {
    this.logData({ userId }, `findOne by id: ${id}`);
    return this.mailService.get(id, userId);
  }

  // CREATE mail endpoint
  @Post()
  @UseGuards(new AuthGuard()) // JWT AuthGuard
  @UsePipes(new ValidationPipe()) // Data Validation pipe
  add(@Body() data: MailDTO, @User('id') userId: any) {
    this.logData({ data, userId }, 'ADD MAIL');
    return this.mailService.add(userId, data);
  }

  // UPDATE mail by ID endpoint
  @Put(':id')
  @UseGuards(new AuthGuard()) // JWT AuthGuard
  @UsePipes(new ValidationPipe()) // Data Validation pipe
  // update partial (not all required fields)
  update(@Param('id') id, @User('id') userId, @Body() data: Partial<MailDTO>) {
    // log UPDATE data
    this.logData({ data, userId }, `UPDATE MAIL with id: ${id}`);
    return this.mailService.update(id, userId, data);
  }

  // DELETE mail FROM DB by ID endpoint
  @Delete(':id')
  @UseGuards(new AuthGuard()) // JWT AuthGuard
  async deleteMail(@Param('id') id, @User('id') userId) {
    this.logData({ userId }, `DELETE MAIL with id: ${id}`);
    return { result: await this.mailService.delete(id, userId) };
  }
}
