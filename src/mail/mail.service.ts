import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MailEntity } from './mail.entity';
import { MailDTO, MailRO } from './mail.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(MailEntity)
    private readonly mailRepository: Repository<MailEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private logger = new Logger('MailService');

  // ensure that userId do CRUD ops on his records
  private ensureOwnership = (userId: string, mail: MailEntity) => {
    if (userId !== mail.user.id) {
      throw new HttpException(
        `User with id ${userId} has no access to this mail.id ${mail.id}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  };

  // construct response object with mail and user objects
  private constructResponseObject(mail: MailEntity): MailRO {
    return {
      ...mail,
      user: mail.user.toResponseObject(false),
    };
  }

  // Get ALL mails from DB service method
  // allowed for all users
  async getAll(): Promise<MailRO[]> {
    this.logger.log(`getAll records from DB`);
    // add relations to user trough userId
    const data = await this.mailRepository.find({ relations: ['user'] });
    if (!data) {
      throw new HttpException('Records not found', HttpStatus.NO_CONTENT);
    }
    return data.map(mail => this.constructResponseObject(mail));
  }

  // get mail by ID service method
  async get(id: string, userId: string): Promise<MailRO> {
    // find mail by mail.id with relations to user.entity
    const data = await this.mailRepository.findOne({
      where: { id },
      relations: ['user'],
    }); // get data
    if (!data) {
      // throw HttpException
      throw new HttpException(`Record "${id}" not exist`, HttpStatus.NOT_FOUND);
    }
    // ensure user can read this mail
    this.ensureOwnership(userId, data);
    this.logger.warn(`GET data: ${JSON.stringify(data)}`);
    return this.constructResponseObject(data);
  }

  // add mail service method
  async add(userId: string, data: MailDTO): Promise<MailRO> {
    this.logger.log(`check user in db by userID: ${userId}`);
    // find user dispatched in controller from JWT token by @User('username') decorator
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    // if user not found
    if (!user) {
      throw new HttpException(
        `User by this JWT id: ${userId} not exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.log(`create new mail record using relations to user entity`);
    // Create Mail in mailRepository with relations to user.entity
    const mail = await this.mailRepository.create({
      ...data,
      user,
    });
    // save data
    await this.mailRepository.save(mail);
    this.logger.log(`record ${JSON.stringify(mail)} saved successfully`);
    // return saved data without token and password
    return this.constructResponseObject(mail);
  }

  // update mail by ID service method
  // handle error using Promise onrejected(catch) and async chaining style
  async update(
    id: string, // mail.id
    userId: string, // mail.user.id
    data: Partial<MailDTO>,
  ): Promise<MailRO> {
    return this.mailRepository
      .findOne({ where: { id }, relations: ['user'] })
      .then(async mail => {
        if (!mail) {
          throw new HttpException(
            `Record "${id}" not found`,
            HttpStatus.NOT_FOUND,
          );
        }
        // ensure that user granted to update this mail record
        this.ensureOwnership(userId, mail);
        await this.mailRepository.update(id, data); // update data by ID
        return this.constructResponseObject(
          await this.mailRepository.findOne({
            where: { id },
            relations: ['user'],
          }),
        ); // return updated data from DB
      });
  }

  //  delete mail by ID service method
  async delete(id: string, userId: string) {
    return this.mailRepository
      .findOne({ where: { id }, relations: ['user'] })
      .then(async mail => {
        if (!mail) {
          throw new HttpException(
            `Record "${id}" not found`,
            HttpStatus.NOT_FOUND,
          );
        }
        // ensure that user granted to delete this mail record
        this.ensureOwnership(userId, mail);
        await this.mailRepository.delete(id);
        return `message with id: ${id} deleted`;
      });
  }
}
