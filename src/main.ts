import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
// setup port
const gwPort = process.env.PORT || 3000;
const redisUrl = 'redis://localhost:6379';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(port);
  // Logger.log(`NestJS server started at ${port} port`, 'Bootstrap');

  /*
   *  Hybrid application (HTTP + TCP)
   * */
  // Create nest APP
  const app = await NestFactory.create(AppModule);
  // Setup Redis RPC transport
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: { url: redisUrl, retryAttempts: 5, retryDelay: 3000 },
  });
  // Hookup RPC service and GW
  const srv1 = app.startAllMicroservicesAsync();
  const srv2 = app.listen(gwPort);
  Promise.all([srv1, srv2])
    .then(() => {
      Logger.warn(`services hooked up`, 'bootsrap async');
    })
    .catch(e => {
      Logger.error(e, '', 'async bootsrap');
    });
  // await app.startAllMicroservicesAsync();
  // await app.listen(gwPort);
}
bootstrap();
