import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { MailService } from './mail.service';
// import { Mail } from './interfaces/mail.interface';
import { Mail } from './mail.entity';
import { CreateMailDto } from './dto/create-mail.dto';

@Controller('mail')
export class MailController {
  // inject dependencies through constructor
  constructor(private readonly mailService: MailService) {}
  // Get ALL mails from DB endpoint
  @Get()
  showAllRecords(@Query() query): Promise<Mail[]> {
    Logger.log('client invoke "showAllRecords"', 'mail.controller');
    return this.mailService.getAllMailRecords(query);
  }

  // GET mail FROM DB by ID
  // http://localhost:3000/mail/12344324
  // id = 12344324
  @Get(':id')
  findOne(@Param('id') id) {
    return `This action return #${id} mail ID`;
  }

  // Create
  @Post()
  Add(@Body() mail: CreateMailDto): Promise<Mail> {
    Logger.log('client invoke "Add" mail', 'mail.controller');
    return this.mailService.add(mail);
  }

  // Update
  @Put(':id')
  Update(@Param('id') id: string, @Body() mail: Partial<Mail>) {
    return 'mail updated';
  }

  // DELETE mail FROM DB by ID
  @Delete(':id')
  deleteMail(@Param('id') id) {
    return `mail ${id} deleted`;
  }

  // Express req object
  // getHeaders(@Req() req): object {
  //   return {
  //     reqQuery: req.query,
  //     reqHeaders: req.headers,
  //     reqKeys: Object.keys(req),
  //   };
  // }
}
