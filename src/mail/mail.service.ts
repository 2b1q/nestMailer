import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  getAllMailRecords(): object {
    Logger.log('client invoke getAllMailRecords()', 'mail.service');
    return [{ title: '', body: '' }];
  }
}
