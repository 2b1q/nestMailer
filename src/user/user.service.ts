import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto, UserRO, UserWithMailsRO } from './user.dto';
import { MailDTO, MailRO } from '../mail/mail.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // show all users from DB
  async showUsers(): Promise<UserRO[]> {
    Logger.log(`Call service Before`, `UserService => showUsers()`);
    const users = await this.userRepository.find();
    Logger.log(
      `Call service after userRepository.find()`,
      `UserService => showUsers()`,
    );
    return users.map(user => user.toResponseObject(false)); // map to response object without password
  }

  // getUser with mails OneToMany relations
  async getUser(userId: string): Promise<UserWithMailsRO> {
    const userWithMails = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['mails'], // relate to mails
    });
    if (!userWithMails) {
      throw new HttpException(
        `data for userId ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    Logger.warn(
      `user with mails data: ${JSON.stringify(userWithMails)}`,
      'getUser',
    );
    // delete user password hash property from response object
    delete userWithMails.password;
    return userWithMails;
  }

  // check user and login
  async login(data: UserDto): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    let checkPass;
    try {
      checkPass = await user.comparePassword(password);
    } catch (e) {
      Logger.log(e, 'login');
    }

    Logger.log(
      `Compare password status: ${checkPass}`,
      'user.service => login',
    );
    // if (!user || !(await user.comparePassword(password))) {
    if (!user || !checkPass) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user.toResponseObject();
  }

  // register new user
  async register(data: UserDto): Promise<UserRO> {
    const { username } = data;
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user) {
      throw new HttpException(
        `User ${user.username} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = this.userRepository.create(data); // create user Object is not a Promise
    Logger.log(
      `User object to create: ${JSON.stringify(newUser)}`,
      'user.service => register',
    );
    // save user into DB
    return this.userRepository
      .save(newUser)
      .then(result => {
        Logger.log(
          `new user successfully saved in DB: ${JSON.stringify(result)}`,
          'user.service => register',
        );
        return result.toResponseObject(); // return user object with jwt
      })
      .catch(e => {
        throw new HttpException(
          `error while saving user: ${e}`,
          HttpStatus.BAD_REQUEST,
        );
      });

    // return user.toResponseObject(); // return user object with jwt
  }
}
