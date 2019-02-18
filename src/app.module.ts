import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { MailModule } from './mail/mail.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';

@Module({
  imports: [MailModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter, // global http Exception Error handler filter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // global Logger interceptor
    },
  ],
})
export class AppModule {}
