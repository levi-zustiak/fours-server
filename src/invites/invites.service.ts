import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@Injectable()
export class InvitesService {
  private activeSockets: { id: string, user: string, }[] = [];
  private logger: Logger = new Logger('InviteGateway');

  join(client: Socket, user) {
    const existingSocket = this.findSocket(user);

    if (!existingSocket) {
      this.activeSockets = [...this.activeSockets, { id: client.id, user }];
    }

    return this.logger.log(`Created client ${client.id} for ${user}`);
  }

  message(client: Socket, { description, to, from }) {
    const socket = this.findSocket(to);

    if (socket) {
      client.broadcast.to(socket.id).emit('message-received', {
        description: description,
        from: from,
      });
      return this.logger.log(`User ${from} sent message to ${to}`);
    } else {
      console.log('No socket found');
    }
  }

  sendCandidate(client: Socket, { candidate, peer }) {
    const socket = this.findSocket(peer);

    if (socket) {
      client.broadcast.to(socket.id).emit('ice-candidate-received', {
        candidate: candidate,
      });
      return this.logger.log(`Client ${client.id} sent ice candidate to ${socket.id}`);
    }
    console.log('no candidate found');
  }

  public findSocket(user: string) {
    return this.activeSockets?.find((socket) => socket.user === user);
  }

  public init(server: Server) {
    return this.logger.log('Init');
  }

  public disconnect(client: Socket) {
    const existingSocket = this.activeSockets.find((socket) => socket.id === client.id);

    if (!existingSocket) return;

    this.activeSockets = this.activeSockets.filter((socket) => socket.id !== client.id);

    //Modify this to notify player their opponent has disconnected
    // client.broadcast.emit(`${existingSocket.user}-remove-player`, {
    //   socketId: client.id,
    // });

    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
