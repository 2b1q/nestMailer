import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @BeforeInsert()
  async hashThePass() {
    // bcrypt.hash(this.password, 10).then(hash => (this.password = hash));
    // OR we can use async await form
    this.password = await bcrypt.hash(this.password, 10);
  }

  // compare passed plain password (attempt) with encrypted using bcrypt
  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  // construct response object without password to avoid pwd leaks
  toResponseObject(showToken: boolean = true) {
    const { id, created, username, token } = this;
    const response: any = { id, created, username };
    if (showToken) {
      response.token = token;
    }
    return response;
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign({ id, username }, process.env.JWTSECRET, {
      expiresIn: '7d',
    });
  }
}
