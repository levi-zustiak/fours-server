import { User } from '@/common/interfaces';
import { Board } from '@/common/types/game.types';
import { v4 } from 'uuid';

export class Game {
  public id: string;
  public p1: User;
  public p2: User;
  public currentPlayer: string;
  public gameOver: boolean;
  public board: Board;

  constructor(playerId: string) {
    this.id = v4();
    this.currentPlayer = playerId;
    this.board = [
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ];
    this.gameOver = false;
  }

  async update(user: User, col: number) {
    const board = this.board.map((column) => [...column]);
    const row = board[col].indexOf(null);

    const position = { col, row };

    board[col][row] = {
      id: v4(),
      player: user,
      position,
    };

    this.board = board;

    return {
      currentPlayer: this.currentPlayer,
      board: this.board,
      gameOver: this.gameOver,
    };
  }
}
