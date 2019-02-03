import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mail } from './interfaces/mail.interface';
import { CreateMailDto } from './dto/create-mail.dto';

@Injectable()
export class MailService {
  constructor(@InjectModel('Mail') private readonly mailModel: Model<Mail>) {}
  // Get ALL mails from DB
  async getAllMailRecords(): Promise<Mail[]> {
    Logger.log('client invoke getAllMailRecords()', 'mail.service');
    return await this.mailModel.find().exec();
  }

  // add mail
  async add(createMail: CreateMailDto): Promise<Mail> {
    const createdMail = new this.mailModel(createMail);
    return await createdMail.save();
  }
}
