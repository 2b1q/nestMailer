import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { NewmailController } from './newmail/newmail.controller';
import { NewmailService } from './newmail/newmail.service';

const mongoUri = process.env.MURI || 'mongodb://localhost:27017/nestMail';

@Module({
  providers: [MailService, NewmailService],
  controllers: [MailController, NewmailController],
  imports: [MongooseModule.forRoot(mongoUri, { useNewUrlParser: true })],
})
export class MailModule {}
