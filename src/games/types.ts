import { HttpStatus } from "@nestjs/common";
import { Socket } from 'socket.io';
import { Game } from "./entities/Game.entity";

export type User = {
    id: string;
    name: string;
}

// export type Game = {
//     id: string;
//     players: Players;
//     state: GameState;
// }

export type Response = {
    status: HttpStatus;
    data?: unknown;
    error?: unknown;
}

export interface CustomSocket extends Socket {
    gameId: string;
    user: User;
}

export type Session = {
    users: Array<User>;
    game: null | Game;
}

export type Sessions = {
    [key: string]: Session;
    id?: Session;
}