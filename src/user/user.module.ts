import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailEntity } from '../mail/mail.entity';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([MailEntity, UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
