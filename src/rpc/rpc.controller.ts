import { Controller, Get, Logger, Param } from '@nestjs/common';
import {
  Client,
  ClientProxy,
  ClientProxyFactory,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('rpc')
export class RpcController {
  @Client({ transport: Transport.REDIS })
  client: ClientProxy;

  @Get('ping/:service')
  call(@Param('service') service: string): Observable<number> {
    Logger.warn(`call method ping to service: ${service}`, 'RpcController');
    const pattern = { cmd: 'ping' };
    const data = [1, 2, 3, 4, 5, { service, cmd: 'ping' }];
    return this.client.send<any>(pattern, data);
  }

  @MessagePattern({ cmd: 'ping' })
  sum(data: any): any {
    return data || {};
  }
}
