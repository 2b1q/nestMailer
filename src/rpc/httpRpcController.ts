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

  // handle RPC message with pattern { cmd: 'pong' }
  @MessagePattern({ cmd: 'pong' })
  pong(data: any) {
    // log data from RedisRPC
    Logger.log(
      `got cmd pong with data\n${JSON.stringify(data)}`,
      `HttpRpcController`,
    );
    // return RPC response
    return {
      msg: 'response',
      fromService: 'nestMail.gw.HttpRpcController',
    };
  }
}
