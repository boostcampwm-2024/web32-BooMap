import { HttpException } from '@nestjs/common';

export class authException extends HttpException {
  constructor(message: string = 'Unauthorized', statusCode: number = 401) {
    super(message, statusCode);
  }
}

export class ConnectionException extends HttpException {
  constructor(message: string = 'Connection Error', statusCode: number = 400) {
    super(message, statusCode);
  }
}

export class MindmapException extends HttpException {
  constructor(message: string = 'Mindmap Error', statusCode: number = 400) {
    super(message, statusCode);
  }
}

export class NodeException extends HttpException {
  constructor(message: string = 'Node Error', statusCode: number = 400) {
    super(message, statusCode);
  }
}

export class UserException extends HttpException {
  constructor(message: string = 'User Error', statusCode: number = 400) {
    super(message, statusCode);
  }
}

export class DashboardException extends HttpException {
  constructor(message: string = 'Dashboard Error', statusCode: number = 400) {
    super(message, statusCode);
  }
}
