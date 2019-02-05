import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mail } from './mail.entity';
import { CreateMailDto } from './dto/create-mail.dto';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Mail)
    private readonly mailRepo: Repository<Mail>,
  ) {}
  // Get ALL mails from DB
  async getAllMailRecords(): Promise<Mail[]> {
    Logger.log('client invoke getAllMailRecords()', 'mail.service');
    return await this.mailRepo.find();
  }

  // add mail
  async add(createMail: CreateMailDto): Promise<Mail> {
    // const createdMail = new this.mailModel(createMail);
    return this.mailRepo.save(createMail);
  }
}
