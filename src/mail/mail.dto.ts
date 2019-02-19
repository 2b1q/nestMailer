/*
 * Mail object interface definition
 * and class validator
 * */

import { IsString } from 'class-validator';

export class MailDTO {
  @IsString()
  title: string;
  @IsString()
  from: string;
  @IsString()
  to: string;
  @IsString()
  message: string;
  date: string;
}
