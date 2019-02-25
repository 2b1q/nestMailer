import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailEntity } from './mail.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailEntity, UserEntity])],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
