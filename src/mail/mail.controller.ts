import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';

import { MailService } from './mail.service';
import { MailDTO } from './mail.dto';
import { ValidationPipe } from '../shared/validation.pipe';

/*
 * CRUD mail controller
 * */
@Controller('mail')
export class MailController {
  // inject dependencies (MailService) through constructor
  constructor(private readonly mailService: MailService) {}

  // define private logger
  private logger = new Logger('MailController');

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
  @UsePipes(new ValidationPipe())
  add(@Body() data: MailDTO) {
    // log POST data
    this.logger.log(`Add email: ${JSON.stringify(data)}`);
    return this.mailService.add(data);
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
