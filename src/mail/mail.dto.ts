/*
 * Mail object interface definition
 * and class validator
 * */

import { IsString } from 'class-validator';

export class MailDTO {
  title: string;
  @IsString()
  from: string;
  @IsString()
  to: string;
  message: string;
  date: string;
}
