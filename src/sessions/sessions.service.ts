import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { v4 } from 'uuid';

import { ISession, IUser, IResponse } from './interfaces';

const Status = {
  SUCCESS: true,
  ERROR: false,
};

@Injectable()
export class SessionsService {
  private gameSessions: ISession[] = [];

  public async create({ user }): Promise<IResponse> {
    try {
      const gameId = await v4().slice(0, 8);

      const gameSession = {
        id: gameId,
        players: [user],
      };
  
      this.gameSessions = [
        ...this.gameSessions,
        gameSession,
      ];
  
      console.log(`${user} created a game session`);
      
      console.log(gameSession);

      return this.ok({ gameId: gameSession.id });
    } catch (e) {
      return this.err(e);
    }
  }

  public join(client: Socket, { gameId, user }) {
    try {
      const existingGameSession = this.findGameSession(gameId);

      if (existingGameSession.players?.length < 2) {
        existingGameSession.players?.push(user);
      } else {
        throw new Error('Game session is full');
      }

      client.broadcast.to(existingGameSession.players[0]?.socket).emit('player-joined', {
        peer: existingGameSession.players[1],
      });
  
      console.log(`${user} joined a game session`);
  
      console.log(existingGameSession);

      return this.ok({
        gameId: gameId,
        peer: existingGameSession.players[0],
      });
    } catch (e) {
      console.log(e);
      return this.err(e);
    }
  }

  public end(client: Socket, { gameId }) {
    console.log('endSession', gameId)
    const existingGameSession = this.findGameSession(gameId)

    try {
      if (existingGameSession) {
        this.removePlayer(client, existingGameSession)
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async message(client: Socket, { to, description }): Promise<IResponse> {
    try {
      console.log('message', to, description)
      const player = await this.findPlayer(to);
      
      client.broadcast.to(player.socket).emit('message-received', {
        description: description,
      });

      console.log(`Sent message to ${to} ${player.socket}`);

      return this.ok();
    } catch (e) {
      return this.err(e);
    }
  }

  public async send(client: Socket, { peer, candidate }): Promise<IResponse> {
    try {
      const player = await this.findPlayer(peer);
  
      client.broadcast.to(player.socket).emit('ice-candidate-received', {
        candidate: candidate,
      });

      // wait for callback from client?
      
      console.log(`sent ice candidate to ${player.name}`)

      return this.ok();
    } catch (e) {
      return this.err(e);
    }
  }

  private findGameSession(gameId: string): ISession {
    const gameSession = this.gameSessions?.find((gameSession) => gameSession.id === gameId);

    if (!gameSession) {
      console.log('Failed to find gameSession');
      throw new Error('Failed to find gameSession');
    } 

    return gameSession;
  }

  private async findPlayer(to: IUser): Promise<IUser> {
    const player = this.gameSessions?.flatMap(gameSession => gameSession.players)?.find((player) => player.socket === to.socket);

    if (!player) {
      console.log('Failed to find player');
      throw new Error('Failed to find player');
    }
    
    return player;
  }

  private async removePlayer(client, existingGameSession) {
    if (existingGameSession.players.length === 1) {
      const index = this.gameSessions.indexOf(existingGameSession);
      
      this.gameSessions.splice(index, 1);

      console.log(`Game session was removed`);
    } else {
      const players = existingGameSession.players.filter((player) => player.socket !== client.id);
      
      existingGameSession.players = players;

      client.broadcast.to(players[0].socket).emit('player-left');

      console.log(`Player disconnected: ${client.id}`)
    }
  }

  private ok(data?: any): IResponse {
    return {
      status: Status.SUCCESS,
      data: data,
    }
  }

  private err(e): IResponse {
    return {
      status: Status.ERROR,
      error: e,
    }
  }

  public init(server: Server) {
    return console.log('Init');
  }

  public disconnect(client: Socket) {
    const existingGameSession = this.gameSessions.find((gameSession) => gameSession.players.find((player) => player.socket === client.id));

    try {
      if (existingGameSession) {
        this.removePlayer(client, existingGameSession);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
