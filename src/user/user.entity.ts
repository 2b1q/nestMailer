import { Logger } from '@nestjs/common';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { MailEntity } from '../mail/mail.entity';

@Entity('user')
export class UserEntity {
  // @PrimaryGeneratedColumn('uuid') // => using this we have an error
  // "error while saving user: TypeError: Cannot read property 'createValueMap' of undefined"
  // id: string;
  // @ObjectIdColumn() id: ObjectID; // for MongoDB
  @PrimaryGeneratedColumn('uuid') id: string;

  // relationship
  @OneToMany(type => MailEntity, mail => mail.user)
  mails: MailEntity[];

  // user created Date
  @CreateDateColumn() created: Date;

  // user updated Date
  @UpdateDateColumn() updated: Date;

  // uniq username
  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  // password hash
  @Column('text')
  password: string;

  // before insert trigger
  @BeforeInsert()
  async hashThePass() {
    // bcrypt.hash(this.password, 10).then(hash => (this.password = hash));
    // OR we can use async await form
    this.password = await bcrypt.hash(this.password, 10);
    Logger.log(
      `hashed password: ${this.password}`,
      'user.entity => hashThePass',
    );
  }

  // compare passed plain password (attempt) with encrypted using bcrypt
  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  // construct response object without password to avoid pwd leaks
  toResponseObject(showToken: boolean = true): UserRO {
    const { id, created, updated, username, token } = this; // destruct data from this
    const response: any = { id, created, updated, username }; // any -> bcz sometime token property can be omitted
    if (showToken) {
      response.token = token;
      Logger.log(`jwt: ${token}`, 'user.entity => toResponseObject');
    }
    return response;
  }

  // private token getter
  private get token() {
    const { id, username } = this;
    return jwt.sign({ id, username }, process.env.JWTSECRET, {
      expiresIn: '7d',
    });
  }
}
