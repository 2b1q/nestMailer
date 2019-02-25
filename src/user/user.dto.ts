import { IsNotEmpty } from 'class-validator';
import { ObjectID } from 'typeorm';

export class UserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserRO {
  id: ObjectID;
  created: Date;
  updated: Date;
  username: string;
  token?: string;
}
