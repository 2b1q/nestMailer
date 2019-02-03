import * as mongoose from 'mongoose';

export const MailSchema = new mongoose.Schema({
  title: String,
  from: String,
  to: String,
  message: String,
  date: Date,
});
