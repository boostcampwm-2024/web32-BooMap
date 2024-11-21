import { WsException } from '@nestjs/websockets';

export class InvalidMindmapIdException extends WsException {
  constructor() {
    super('Invalid mindmap id');
  }
}

export class NodeNotFoundException extends WsException {
  constructor(nodeId: number) {
    super('Node not found : ' + nodeId);
  }
}

export class DatabaseException extends WsException {
  constructor(message: string) {
    super(message);
  }
}
