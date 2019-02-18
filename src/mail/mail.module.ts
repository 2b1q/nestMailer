import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { NewmailController } from './newmail/newmail.controller';
import { NewmailService } from './newmail/newmail.service';
import { Mail } from './mail.entity';
import { HttpErrorFilter } from '../shared/http-error.filter';
import { LoggingInterceptor } from '../shared/logging.interceptor';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Mail])],
  providers: [
    MailService,
    NewmailService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter, // http Error handler filter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // Logger interceptor
    },
  ],
  controllers: [MailController, NewmailController],
})
export class MailModule {}
