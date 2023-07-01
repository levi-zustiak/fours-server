import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class GameService {
  private logger: Logger = new Logger('GameService');

  public init(server: Server) {
    this.logger.log('Init');
  }

  public connect(client) {
    this.logger.log(`Client ${client.id} connected`);
  }

  public disconnect(client) {
    this.logger.log(`Client ${client.id} disconnected`);
  }
}
