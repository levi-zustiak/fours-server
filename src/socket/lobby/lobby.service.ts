import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { CreateDto } from './dto/CreateDto';
import { JoinDto } from './dto/JoinDto';
import { UpdateDto } from './dto/UpdateDto';
import { Lobby } from './entities/lobby.entity';

@Injectable()
export class LobbyService {
  private logger: Logger = new Logger('GameService');
  private lobbies = new Map<string, Lobby>();

  constructor(private eventEmitter: EventEmitter2) {}

  public create(client: Socket, data: CreateDto): Lobby {
    const { user } = data;

    const lobby = new Lobby();

    lobby.setHost(user);

    client.join(lobby.id);

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  public join(client: Socket, data: JoinDto): void {
    const { id, user } = data;

    console.log(id, user);

    const lobby = this.getLobby(id);

    console.log(lobby);

    lobby.setPeer(user);

    client.join(lobby.id);

    lobby.newGame();

    this.eventEmitter.emit('lobby:start', lobby);
  }

  public async move(client: Socket, data: UpdateDto): Promise<void> {
    const { id, user, col } = data;

    const lobby = this.getLobby(id);

    const state = await lobby.game.update(user, col);

    console.log(state);

    this.eventEmitter.emit('game:update', { id: lobby.id, state });
  }

  private getLobby(lobbyId: string): Lobby {
    return this.lobbies.get(lobbyId);
  }

  public init(server: Server) {
    this.logger.log('Init');
  }

  public connect(client: Socket) {
    this.logger.log(`Client ${client.id} connected`);
  }

  public disconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }
}
