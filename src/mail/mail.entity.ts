import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';

/*
 * 'mail' DB collection definition for typeorm
 * with relationship to User.entity
 * many emails reference to One User (manyToOne)
 * */
@Entity('mail')
export class MailEntity {
  @ObjectIdColumn() id: ObjectID;

  @Column() title: string;

  @Column() from: string;

  @Column() to: string;

  @Column() message: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  // relationship
  @ManyToOne(type => UserEntity, user => user.mails)
  user: UserEntity;
}
