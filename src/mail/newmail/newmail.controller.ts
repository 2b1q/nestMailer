import { Controller, Get } from '@nestjs/common';
import { NewmailService } from './newmail.service';

@Controller('api/newmail')
export class NewmailController {
  constructor(private readonly newmailService: NewmailService) {}

  @Get()
  loadNewMail() {
    return this.newmailService.loadNewMail();
  }
}
