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

  // construct response object with mail and user objects
  private constructResponseObject(mail: MailEntity): MailRO {
    return {
      ...mail,
      user: mail.user.toResponseObject(false),
    };
  }

  // Get ALL mails from DB service method
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
  async get(id: string): Promise<MailRO> {
    let data; // define empty response data container
    // handle error in sync style using try-catch
    try {
      data = await this.mailRepository.findOne({
        where: { id },
        relations: ['user'],
      }); // get data
    } catch (e) {
      // throw HttpException
      throw new HttpException(`Record "${id}" not exist`, HttpStatus.NOT_FOUND);
    }
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
  async update(id: string, data: Partial<MailDTO>): Promise<MailRO> {
    return this.mailRepository
      .findOne({ where: { id }, relations: ['user'] })
      .then(async () => {
        await this.mailRepository.update(id, data); // update data by ID
        return this.constructResponseObject(
          await this.mailRepository.findOne({
            where: { id },
            relations: ['user'],
          }),
        ); // return updated data from DB
      })
      .catch(() => {
        throw new HttpException(
          `Record "${id}" not found`,
          HttpStatus.NOT_FOUND,
        );
      });
  }

  //  delete mail by ID service method
  async delete(id: string) {
    try {
      await this.mailRepository.findOne({ where: { id } });
    } catch (e) {
      throw new HttpException(`Record ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.mailRepository.delete(id);
    return { deleted: true };
  }
}
