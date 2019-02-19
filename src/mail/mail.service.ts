import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Mail } from './mail.entity';
import { MailDTO } from './mail.dto';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Mail)
    private readonly mailRepo: Repository<Mail>,
  ) {}

  // Get ALL mails from DB service method
  async getAll() {
    const data = await this.mailRepo.find();
    if (!data) {
      throw new HttpException('Records not found', HttpStatus.NO_CONTENT);
    }
    return data;
  }

  // get mail by ID service method
  async get(id: string) {
    let data; // define empty response data container
    // handle error in sync style using try-catch
    try {
      data = await this.mailRepo.findOne(id); // get data
    } catch (e) {
      // throw HttpException
      throw new HttpException(`Record "${id}" not exist`, HttpStatus.NOT_FOUND);
    }
    return data;
  }

  // add mail service method
  async add(data: MailDTO) {
    const mail = await this.mailRepo.create(data);
    await this.mailRepo.save(mail);
    return mail;
  }

  // update mail by ID service method
  // handle error using Promise onrejected(catch) and async chaining style
  async update(id: string, data: Partial<MailDTO>) {
    return this.mailRepo
      .findOne(id)
      .then(async () => {
        await this.mailRepo.update(id, data); // update data by ID
        return await this.mailRepo.findOne(id); // return updated data from DB
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
      await this.mailRepo.findOne(id);
    } catch (e) {
      throw new HttpException(`Record ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.mailRepo.delete(id);
    return { deleted: true };
  }
}
