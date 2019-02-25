/*
 * MailEntity object interface definition
 * and class validator
 * */

import { IsString } from 'class-validator';
import { UserRO } from '../user/user.dto';
import { ObjectID } from 'typeorm';

export class MailDTO {
  title: string;
  @IsString()
  from: string;
  @IsString()
  to: string;
  message: string;
}

// Mail response object with user data
export class MailRO {
  id: ObjectID;
  title?: string;
  to: string;
  from: string;
  created: Date;
  updated: Date;
  message?: string;
  user: UserRO;
}
