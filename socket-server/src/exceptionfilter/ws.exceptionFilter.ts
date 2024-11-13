import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  constructor() {
    super();
  }

  catch(exception: WsException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    client.emit('error', exception.getError());
  }
}
