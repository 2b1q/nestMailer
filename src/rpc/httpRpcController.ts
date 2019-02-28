import { Controller, Get, Logger, Param } from '@nestjs/common';
import { RpcService } from './rpc.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('rpc')
export class HttpRpcController {
  constructor(private rpcService: RpcService) {}

  // Http GET 'rpc/ping/:service' endpoint handler
  @Get('ping/:service')
  ping(@Param('service') service: string) {
    return this.rpcService.rpcPing(service);
  }

  @MessagePattern({ cmd: 'ping' })
  pingData(data: any): any {
    return data || {};
  }
}
