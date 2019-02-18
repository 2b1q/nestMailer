import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';
/*
 * 'mail' DB collection definition for typeorm
 * */
@Entity('mail')
export class Mail {
  @ObjectIdColumn() id: ObjectID;

  @Column() title: string;

  @Column() from: string;

  @Column() to: string;

  @Column() message: string;

  @Column() date: string;
}
