import { WsException } from '@nestjs/websockets';

export class InvalidMindmapIdException extends WsException {
  constructor() {
    super('Invalid mindmap id');
  }
}

export class NodeNotFoundException extends WsException {
  constructor() {
    super('Node not found');
  }
}

export class DatabaseError extends WsException {
  constructor(message: string) {
    super(message);
  }
}
