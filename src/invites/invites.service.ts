import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface IPlayer {
  clientId: string;
  user: string;
};

interface IGameSession {
  id: string;
  players: Array<IPlayer>;
};

@Injectable()
export class InvitesService {
  private gameSessions: IGameSession[] = [];
  private logger: Logger = new Logger('InviteGateway');

  public create(client: Socket, { gameSessionId, user }) {
    const gameSession = {
      id: gameSessionId,
      players: [
        {
          clientId: client.id,
          user: user,
        }
      ],
    };

    this.gameSessions = [
      ...this.gameSessions,
      gameSession,
    ];

    this.logger.log(`${user} created a game session`);
    
    console.log(gameSession);
    
    return {
      connected: true,
      gameSessionId: gameSessionId,
      user: user,
    };
  }

  public join(client: Socket, { gameSessionId, user }) {
    const existingGameSession = this.findGameSession(gameSessionId);

        if (existingGameSession) {
          if (existingGameSession.players?.length < 2) {
            existingGameSession.players?.push({
              clientId: client.id,
              user: user,
            });
          } else {
            client.broadcast.to(client.id).emit('game-session-full');
            return
          }

          client.broadcast.to(existingGameSession.players[0]?.clientId).emit('player-joined', {
            player: user,
          });
        }

        this.logger.log(`${user} joined a game session`);

        console.log(existingGameSession);

        return {
          connected: true,
          gameSessionId: gameSessionId,
          user: user,
          player: existingGameSession.players[0]?.user,
        };
  }

  public async message(client: Socket, { gameSessionId, description, to }) {
    const player = await this.findPlayer(gameSessionId, to);

    if (player) {
      client.broadcast.to(player.clientId).emit('message-received', {
        description: description,
      });
      return this.logger.log(`User ${player.user} sent message to ${to}`);
    } else {
      console.log('No socket found');
    }
  }

  public async sendCandidate(client: Socket, { gameSessionId, peer, candidate }) {
    const player = await this.findPlayer(gameSessionId, peer);

    if (player) {
      client.broadcast.to(player.clientId).emit('ice-candidate-received', {
        candidate: candidate,
      });
      return this.logger.log(`sent ice candidate to ${player.user}`);
    }

    console.log('no candidate found');
  }

  private findGameSession(gameSessionId: string): IGameSession {
    return this.gameSessions?.find((gameSession) => gameSession.id === gameSessionId);
  }

  private async findPlayer(gameSessionId: string, user: string): Promise<IPlayer> {
    const existingGameSession = await this.findGameSession(gameSessionId);
    const player = existingGameSession?.players?.find((player) => player.user === user);

    return player;
  }

  public init(server: Server) {
    return this.logger.log('Init');
  }

  public disconnect(client: Socket) {
    const existingGameSession = this.gameSessions.find((gameSession) => gameSession.players.find((player) => player.clientId === client.id));

    if (existingGameSession) {
      if (existingGameSession.players.length === 1) {
        const index = this.gameSessions.indexOf(existingGameSession);
        
        this.gameSessions.splice(index, 1);

        this.logger.log(`Game session was removed`);
      } else {
        const players = existingGameSession.players.filter((player) => player.clientId !== client.id);
        
        existingGameSession.players = players;

        client.broadcast.to(players[0].clientId).emit('player-left');

        this.logger.log(`Player disconnected: ${client.id}`);
      }
    }
  }
}
