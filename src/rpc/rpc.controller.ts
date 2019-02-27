import { Controller, Get, Logger, Param } from '@nestjs/common';

@Controller('rpc')
export class RpcController {
  @Get('ping/:service')
  ping(@Param('service') service: string) {
    Logger.warn(`call method ping to service: ${service}`, 'RpcController');

    // mock data
    return {
      status: '',
      service,
    };
  }
}
