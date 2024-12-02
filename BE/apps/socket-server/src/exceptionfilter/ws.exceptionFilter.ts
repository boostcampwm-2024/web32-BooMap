import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger('WsExceptionFilter');

  catch(exception: any, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    const error = exception.getError?.() || exception.message || exception;

    const errorResponse = {
      status: 'error',
      message: typeof error === 'object' ? JSON.stringify(error) : error,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(`WebSocket Error: ${JSON.stringify(errorResponse)}`);
    this.logger.error(`Stack: ${exception.stack}`);

    client.emit('error', errorResponse);

    return;
  }
}
