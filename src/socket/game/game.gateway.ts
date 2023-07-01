import {
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'game',
})
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly gameSvc: GameService) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  public afterInit(server: Server) {
    this.gameSvc.init(server);
  }

  public handleDisconnect(@ConnectedSocket() client: any) {
    return this.gameSvc.disconnect(client);
  }
}
