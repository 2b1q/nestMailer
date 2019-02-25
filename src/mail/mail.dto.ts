/*
 * MailEntity object interface definition
 * and class validator
 * */

import { IsString } from 'class-validator';
import { UserRO } from '../user/user.dto';

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
  id: number;
  title?: string;
  to: string;
  from: string;
  created: Date;
  updated: Date;
  message?: string;
  user?: UserRO;
}

// Mail response object without user data
export class MailWithoutUserRO {
  id: number;
  title?: string;
  to: string;
  from: string;
  created: Date;
  updated: Date;
  message?: string;
}
