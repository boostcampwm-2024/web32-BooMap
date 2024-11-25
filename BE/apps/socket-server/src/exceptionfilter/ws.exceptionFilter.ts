import { ArgumentsHost, Catch, Logger, BadRequestException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, BadRequestException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger('WsExceptionFilter');

  constructor() {
    super();
  }

  catch(exception: WsException | BadRequestException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();

    const errorResponse = {
      status: 'error',
      message: exception instanceof BadRequestException ? (exception.getResponse() as object) : exception.getError(),
      timestamp: new Date().toISOString(),
    };

    this.logger.error(`WebSocket Error: ${JSON.stringify(errorResponse)} - ${exception.stack}`);
    client.emit('error', errorResponse);
  }
}
