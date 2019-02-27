import { Controller, Get, Logger, Param } from '@nestjs/common';
import {
  Client,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Controller('rpc')
export class RpcController {
  // constructor() {
  //   this.client = ClientProxyFactory.create({
  //     transport: Transport.REDIS,
  //     options: {
  //       url: 'redis://localhost:6379',
  //     },
  //   });
  // }

  @Client({
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379',
    },
  })
  private client: ClientProxy;

  @Get('ping/:service')
  async ping(@Param('service') service: string) {
    Logger.warn(`call method ping to service: ${service}`, 'RpcController');

    const conn = await this.client.connect();
    this.client.send({ cmd: 'ping' }, { msg: 123 });
    // mock data
    return {
      status: conn,
      service,
    };
  }
}
