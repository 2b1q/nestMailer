import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MailModule, TypeOrmModule.forRoot()],
})
export class AppModule {}
