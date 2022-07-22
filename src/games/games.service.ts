import { HttpStatus, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

import CreateDto from './dto/create.dto';
import JoinDto from './dto/join.dto';
import MessageDto from './dto/message.dto';
import { Game } from './entities/Game.entity';

import { CustomSocket, Response, Sessions, User } from './types';

type Ack = {
    response: number;
    data?: unknown;
    error?: unknown;
}

@Injectable()
export class GamesService {
    private sessions: Sessions = {};
    
    public async create(client: CustomSocket, { user }: CreateDto): Promise<Ack> {
        try {
            console.log('create game');
            const id = v4();

            this.sessions[id] = {
                users: [],
                game: null
            }
            
            client.user = user;

            console.log(user);

            this.addUser(id, client);
            
            return { response: 200, data: { gameId: id } };
        } catch (e) {
            console.error('Error creating session', e);
            return { response: 400, data: {}, error: { msg: e.toString() } }
        }
    }
    
    public join(client: CustomSocket, { gameId, user }: JoinDto) {
        try {
            console.log('joining', gameId);

            const session = this.sessions[gameId];

            if (session) {
                client.user = user;
                
                this.addUser(gameId, client);
                
                client.to(gameId).emit('player-joined', { user });
                
                console.log(`${user.name} joined a game.`);
                
                return { response: 200, data: { peer: session.users[0] }
                }
            } else {
                throw new Error('Invalid gameId');
            }
        } catch (e) {
            console.error('Error joining session', e);
            return { response: 400, data: {}, error: { msg: e.toString() } }
        }
    }

    // public start(server: Server, client: CustomSocket, { players, options }: StartDto) {
    //     const game = new Game(players, options);

    //     this.sessions[client.gameId].game = game;

    //     //emit game state to players
    // }
    
    public async message(server: Server, client: CustomSocket, { type, data }: MessageDto): Promise<Response> {
        try {
            console.log('message', type, data);
            
            switch (type) {
                case 'MOVE':
                    const game = this.sessions[client.gameId].game

                    const newState = game.checkWin(client.user.id, data?.col);
                    console.log(newState);

                    server.to(client.gameId).emit('message', {
                        type: 'STATE',
                        data: newState
                    });
                    break;

                case 'NEW_GAME':
                    client.to(client.gameId).emit('message', { type: 'NEW_GAME' });
                    break;

                case 'REPLY':
                    if (data?.answer) {}
            }

            //for emitting to other player in game
            // client.to(client.gameId).emit('message', { type, data });

            //for emitting to all players
            // server.to(client.gameId).emit('message', { type, data }); 
            
            return this.success();
        } catch (e) {
            return this.err(e);
        }
    }
    
    private addUser(id: string, client: CustomSocket) {
        if (this.sessions[id].users.length < 2) {
            this.sessions[id].users.push({ ...client.user })
    
            client.join(id);
            client.gameId = id;
        } else {
            console.log('game session full');
        }
    }

    private removeUser(client: CustomSocket) {
        console.log('removing user', client.user);

        if (this.sessions[client.gameId].users.length < 2) {
            delete this.sessions[client.gameId];
        } else {
            this.sessions[client.gameId].users = this.sessions[client.gameId].users.filter(
                (user) => user.id === client.user.id
            );
        }
    }
    
    private success(data?: any): Response {
        return {
            status: HttpStatus.OK,
            data: data,
        }
    }
    
    // change this depending upon error type
    private err(e): Response {
        return {
            status: HttpStatus.NOT_FOUND,
            error: e,
        }
    }
    
    public init(server: Server) {
        return console.log('Init');
    }
    
    public disconnect(client: CustomSocket) {
        console.log('disconnected');

        console.log(client?.gameId, client?.user);
        
        try {
            if (client?.gameId) {
                this.removeUser(client);
            }

            console.log(this.sessions);
        } catch (e) {
            console.log(e);
        }
    }
}
