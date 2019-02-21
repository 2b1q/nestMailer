import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // show all users from DB
  async showUsers() {
    const users = await this.userRepository.find();
    return users.map(user => user.toResponseObject(false)); // map to response object without password
  }

  // check user and login
  async login(data: UserDto) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    let checkPass;
    try {
      checkPass = await user.comparePassword(password);
    } catch (e) {
      Logger.log(e, 'login');
    }

    Logger.log(`Compare password status: ${checkPass}`, 'UserService');
    // if (!user || !(await user.comparePassword(password))) {
    if (!user) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user.toResponseObject();
  }

  // register new user
  async register(data: UserDto) {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    try {
      user = await this.userRepository.create(data);
    } catch (e) {
      throw new HttpException(
        `error while creating user: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new HttpException(
        `error while saving user: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }
}
