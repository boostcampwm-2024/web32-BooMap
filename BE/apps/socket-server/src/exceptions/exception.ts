import { WsException } from '@nestjs/websockets';

export class InvalidConnectionIdException extends WsException {
  constructor() {
    super('Invalid connection id');
  }
}

export class NodeNotFoundException extends WsException {
  constructor(nodeId: number) {
    super('해당 노드를 찾을 수 없습니다. : ' + nodeId);
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

export class AiRequestException extends WsException {
  constructor(message: string) {
    super(`AI request failed : ${message}`);
  }
}

export class InvalidTokenException extends WsException {
  constructor() {
    super('Invalid token');
  }
}

export class UpdateTitleException extends WsException {
  constructor(message: string) {
    super(`Update title failed : ${message}`);
  }
}

export class UnauthorizedException extends WsException {
  constructor() {
    super('권한이 없습니다.');
  }
}
