export type Coords = {
    col: number;
    row: number;
}

export type Player = {
    id: string;
    name: string;
    position: number;
}

export type Players = Array<Player>;

export type Value = null | number;

export type Column = Array<Value>;

export type Board = Array<Column>;

export type GameState = {
    currentPlayer: number;
    winner?: Player;
    loser?: Player;
    draw?: boolean;
    gameOver: boolean;
    board: Board;
}

export type Options = {
    mode?: string;
    time?: number;
    //Other game options
}