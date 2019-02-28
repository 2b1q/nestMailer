import { Injectable, Logger, Param } from '@nestjs/common';

import {
  Client,
  ClientProxy,
  ClientProxyFactory,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class RpcService {
  // add RPC transport client
  @Client({ transport: Transport.REDIS })
  client: ClientProxy;

  // add logging behavior
  private logger = new Logger('RpcService');
  private logData({ data, pattern }, rpc: boolean) {
    if (rpc) {
      this.logger.warn(
        `exec RPC pattern: ${JSON.stringify(
          pattern,
        )} with data: ${JSON.stringify(data)}`,
      );
    }
  }

  // ping service method
  rpcPing(service: string) {
    // construct RPC CMD pattern and payload
    const pattern = { cmd: 'ping' };
    const data = {
      toService: 'nestMail.' + service,
      fromService: 'nestMail.gw.RpcService',
      payload: [1, 2, 3, 4, 5],
    };
    // log sending data
    this.logData({ data, pattern }, true);
    return this.client.send<any>(pattern, data);
  }
}
