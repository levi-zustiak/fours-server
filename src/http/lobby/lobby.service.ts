import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/CreateDto';
import { JoinDto } from './dto/JoinDto';
import { Lobby } from './entities/lobby.entity';

@Injectable()
export class LobbyService {
  private lobbies = new Map<string, Lobby>();

  public create({ user }: CreateDto): Lobby {
    const lobby = new Lobby();

    lobby.setHost(user);

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  public join({ id, user }: JoinDto): Lobby {
    const lobby = this.lobbies.get(id);

    lobby.setPeer(user);

    return lobby;
  }
}
