import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { 
  JoinSessionDto,
  IceCandidateDto,
  MessageDTO,
} from './dto';
import { InvitesService } from './invites.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class InvitesGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  constructor(private readonly invitesService: InvitesService) {}

  @SubscribeMessage('joinSession')
  joinSession(@ConnectedSocket() client: Socket, @MessageBody() joinSessionDto: JoinSessionDto) {
    return this.invitesService.join(client, joinSessionDto);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@ConnectedSocket() client: Socket, @MessageBody() messageDTO: MessageDTO) {
    return this.invitesService.message(client, messageDTO);
  }

  @SubscribeMessage('declineOffer')
  declineInvite(client: Socket, data: any) {
    client.to(data.from).emit('offer-declined', {
      socket: client.id,
    });
  }

  @SubscribeMessage('candidateOffer')
  sendIce(@ConnectedSocket() client: Socket, @MessageBody() iceCandidateDto: IceCandidateDto) {
    return this.invitesService.sendCandidate(client, iceCandidateDto);
  }

  public afterInit(server: Server) {
    return this.invitesService.init(server);
  }

  public handleDisconnect(@ConnectedSocket() client: Socket) {
    return this.invitesService.disconnect(client);
  }
}
