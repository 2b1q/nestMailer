import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto, UserRO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // show all users from DB
  async showUsers(): Promise<UserRO[]> {
    const users = await this.userRepository.find();
    return users.map(user => user.toResponseObject(false)); // map to response object without password
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
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = this.userRepository.create(data); // create user Object is not a Promise
    Logger.log(
      `User object create: ${JSON.stringify(user)}`,
      'user.service => register',
    );
    // save user into DB
    return this.userRepository
      .save(user)
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
