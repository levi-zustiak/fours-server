import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateDto } from './dto/CreateDto';
import { JoinDto } from './dto/JoinDto';
import { UpdateDto } from './dto/UpdateDto';
import { LobbyService } from './lobby.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'lobby',
})
export class LobbyGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly lobbySvc: LobbyService) {}

  @SubscribeMessage('create')
  create(@ConnectedSocket() client: Socket, @MessageBody() data: CreateDto) {
    return this.lobbySvc.create(client, data);
  }

  @SubscribeMessage('join')
  join(@ConnectedSocket() client: Socket, @MessageBody() data: JoinDto) {
    this.lobbySvc.join(client, data);
  }

  @SubscribeMessage('update')
  move(@ConnectedSocket() client: Socket, @MessageBody() data: UpdateDto) {
    this.lobbySvc.move(client, data);
  }

  @OnEvent('lobby:start')
  handleGameStart(lobby) {
    this.server.to(lobby.id).emit('lobby:start', lobby);
  }

  @OnEvent('game:update')
  handleGameUpdate(gameUpdate) {
    const { id, state } = gameUpdate;

    console.log(id, state);

    this.server.to(id).emit('game:update', state);
  }

  public afterInit(server: Server) {
    this.lobbySvc.init(server);
  }

  public handleDisconnect(client: Socket) {
    this.lobbySvc.disconnect(client);
  }
}
