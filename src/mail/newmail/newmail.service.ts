import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NewmailService {
  loadNewMail(): any {
    Logger.log('loadNewMail started', 'NewmailService');
    return new Promise(resolve =>
      setTimeout(() => {
        Logger.log('loadNewMail ended', 'NewmailService');
        resolve('loaded XX emails from ___');
      }, 3000),
    );
  }
}
