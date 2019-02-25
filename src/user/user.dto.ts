import { IsNotEmpty } from 'class-validator';
import { MailRO, MailWithoutUserRO } from '../mail/mail.dto';

export class UserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserRO {
  id: string;
  created: Date;
  updated: Date;
  username: string;
  token?: string;
  mails?: MailRO[];
}

export class UserWithMailsRO {
  id: string;
  created: Date;
  updated: Date;
  username: string;
  mails: MailWithoutUserRO[];
}
