import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
// setup port
const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  Logger.log(`NestJS server started at ${port} port`, 'Bootstrap');
}
bootstrap();
