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
    const data = await this.mailRepo.findOne(id);
    if (!data) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  // add mail service method
  async add(data: MailDTO) {
    const mail = await this.mailRepo.create(data);
    await this.mailRepo.save(mail);
    return mail;
  }

  //  update mail by ID service method
  async update(id: string, data: Partial<MailDTO>) {
    const dataToUpdate = await this.mailRepo.findOne(id);
    if (!dataToUpdate) {
      throw new HttpException(`Record ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.mailRepo.update(id, data); // update data by ID
    return await this.mailRepo.findOne(id); // return updated data from DB
  }
  //  delete mail by ID service method
  async delete(id: string) {
    const dataToDelete = await this.mailRepo.findOne(id);
    if (!dataToDelete) {
      throw new HttpException(`Record ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.mailRepo.delete(id);
    return { deleted: true };
  }
}
