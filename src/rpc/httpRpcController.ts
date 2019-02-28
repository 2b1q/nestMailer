import { Controller, Get, Logger, Param } from '@nestjs/common';
import { RpcService } from './rpc.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class HttpRpcController {
  constructor(private rpcService: RpcService) {}

  // Http GET 'rpc/ping/:service' endpoint handler
  @Get('rpc/ping/:service')
  ping(@Param('service') service: string) {
    return this.rpcService.rpcPing(service);
  }

  @MessagePattern({ cmd: 'ping' })
  pingData(data: any): any {
    return data || {};
  }

  @MessagePattern({ cmd: 'pong' })
  pong(data: any) {
    Logger.log(
      `got cmd pong with data\n${JSON.stringify(data)}`,
      `HttpRpcController`,
    );
  }
}
