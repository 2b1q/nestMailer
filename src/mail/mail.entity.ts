import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';

/*
 * 'mail' DB collection definition for typeorm
 * with relationship to User.entity
 * many emails reference to One User (manyToOne)
 * */
@Entity('mail')
export class MailEntity {
  // @ObjectIdColumn() id: ObjectID; // for mongoDB
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  title: string;

  @Column('text') from: string;

  @Column('text') to: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  message: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  // relationship
  @ManyToOne(type => UserEntity, user => user.mails)
  user: UserEntity;
}
