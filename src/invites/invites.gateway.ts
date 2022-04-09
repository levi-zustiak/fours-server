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
  SendOfferDto,
  AcceptOfferDto,
  IceCandidateDto,
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

  @SubscribeMessage('sendOffer')
  sendOffer(@ConnectedSocket() client: Socket, @MessageBody() sendOfferDto: SendOfferDto) {
    return this.invitesService.offer(client, sendOfferDto);
  }

  @SubscribeMessage('offerAccepted')
  acceptInvite(@ConnectedSocket() client: Socket, @MessageBody() acceptOfferDto: AcceptOfferDto) {
    return this.invitesService.accept(client, acceptOfferDto);
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
