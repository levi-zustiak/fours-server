import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { IceCandidateDto, MessageDTO } from './dto';
import {
  CreateSessionDto,
  JoinSessionDto,
  EndSessionDto,
} from './dto/Session';
import { SessionsService } from './sessions.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SessionsGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  constructor(private readonly sessionsService: SessionsService) {}

  @SubscribeMessage('createSession')
  createSession(@MessageBody() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @SubscribeMessage('joinSession')
  joinSession(@ConnectedSocket() client: Socket, @MessageBody() joinSessionDto: JoinSessionDto) {
    return this.sessionsService.join(client, joinSessionDto);
  }

  @SubscribeMessage('endSession')
  endSession(@ConnectedSocket() client: Socket, @MessageBody() endSessionDto: EndSessionDto) {
    return this.sessionsService.end(client, endSessionDto);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@ConnectedSocket() client: Socket, @MessageBody() messageDTO: MessageDTO) {
    return this.sessionsService.message(client, messageDTO);
  }

  @SubscribeMessage('declineOffer')
  declineInvite(client: Socket, data: any) {
    client.to(data.from).emit('offer-declined', {
      socket: client.id,
    });
  }

  @SubscribeMessage('candidateOffer')
  sendCandidate(@ConnectedSocket() client: Socket, @MessageBody() iceCandidateDto: IceCandidateDto) {
    return this.sessionsService.send(client, iceCandidateDto);
  }

  public afterInit(server: Server) {
    return this.sessionsService.init(server);
  }

  public handleDisconnect(@ConnectedSocket() client: Socket) {
    return this.sessionsService.disconnect(client);
  }
}
