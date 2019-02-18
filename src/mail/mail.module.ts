import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { NewmailController } from './newmail/newmail.controller';
import { NewmailService } from './newmail/newmail.service';
import { Mail } from './mail.entity';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Mail])],
  providers: [MailService, NewmailService],
  controllers: [MailController, NewmailController],
})
export class MailModule {}
