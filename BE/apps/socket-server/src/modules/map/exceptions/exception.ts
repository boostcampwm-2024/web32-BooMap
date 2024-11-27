import { WsException } from '@nestjs/websockets';

export class InvalidConnectionIdException extends WsException {
  constructor() {
    super('Invalid connection id');
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

export class JoinRoomException extends WsException {
  constructor() {
    super('Join room failed');
  }
}
