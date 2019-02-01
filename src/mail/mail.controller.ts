import { Controller, Delete, Get, Logger, Param, Req } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  // Get ALL mails from DB
  @Get()
  showAllRecords() {
    Logger.log('client invoke "showAllRecords"', 'mail.controller');
    return this.mailService.getAllMailRecords();
  }
  // getHeaders(@Req() req): object {
  //   return {
  //     reqQuery: req.query,
  //     reqHeaders: req.headers,
  //     reqKeys: Object.keys(req),
  //   };
  // }

  // GET mail FROM DB by ID
  // http://localhost:3000/mail/12344324
  // id = 12344324
  @Get(':id')
  findOne(@Param('id') id) {
    return `This action return #${id} mail ID`;
  }
  // DELETE mail FROM DB by ID
  @Delete(':id')
  deleteMail(@Param('id') id) {
    return `mail ${id} deleted`;
  }
}
