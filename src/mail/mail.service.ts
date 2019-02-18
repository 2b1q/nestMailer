import { Injectable } from '@nestjs/common';
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
    return (await this.mailRepo.find()) || []; // if no records return empty array
  }

  // get mail by ID service method
  async get(id: string) {
    return (await this.mailRepo.findOne(id)) || {};
  }

  // add mail service method
  async add(data: MailDTO) {
    const mail = await this.mailRepo.create(data);
    await this.mailRepo.save(mail);
    return mail;
  }

  //  update mail by ID service method
  async update(id: string, data: Partial<MailDTO>) {
    await this.mailRepo.update(id, data); // update data by ID
    return await this.mailRepo.findOne(id); // return updated data from DB
  }
  //  delete mail by ID service method
  async delete(id: string) {
    await this.mailRepo.delete(id);
    return { deleted: true };
  }
}
