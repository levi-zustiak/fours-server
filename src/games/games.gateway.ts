import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Server } from 'socket.io';
import { CustomSocket } from './types';

import CreateDto from './dto/create.dto';
import JoinDto from './dto/join.dto';
import MessageDto from './dto/message.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GamesGateway implements OnGatewayInit, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    
    constructor(private readonly gamesService: GamesService) {}
    
    @SubscribeMessage('CREATE')
    createGame(@ConnectedSocket() client: CustomSocket, @MessageBody() createDto: CreateDto) {
        return this.gamesService.create(client, createDto);
    }
    
    @SubscribeMessage('JOIN')
    joinGame(@ConnectedSocket() client: CustomSocket, @MessageBody() joinDto: JoinDto) {
        return this.gamesService.join(client, joinDto);
    }
    
    @SubscribeMessage('MESSAGE')
    sendMessage(@ConnectedSocket() client: CustomSocket, @MessageBody() messageDto: MessageDto) {
        return this.gamesService.message(this.server, client, messageDto);
    }
    
    public afterInit(server: Server) {
        return this.gamesService.init(server);
    }
    
    public handleDisconnect(@ConnectedSocket() client: CustomSocket) {
        return this.gamesService.disconnect(client);
    }
}
