import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
// setup HTTP port and RedisRPC URL
const gwPort = process.env.PORT || 3000;
const redisUrl = process.env.REDISURL || 'redis://localhost:6379';

async function bootstrap() {
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
  Promise.all([srv1, srv2]).then(() => {
    Logger.warn(
      `\nALL SERVICES HOOKED UP:
    > HTTP server started at ${gwPort} port
    > Redis RPC Microservice is hooked up to ${redisUrl}`,
      'Bootstrap async',
    );
  });
}
bootstrap();
