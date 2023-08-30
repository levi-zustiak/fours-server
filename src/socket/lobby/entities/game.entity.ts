import { User } from '@/common/interfaces';
import { Board } from '@/common/types/game.types';
import { v4 } from 'uuid';

type Player = {
  name: string;
  playingAs: string;
};

export class Game {
  public id: string;
  public players: Record<string, Player>;
  public currentPlayer: string;
  public gameOver: boolean;
  public board: Board;

  constructor(startingPlayer: number, host: User, peer: User) {
    this.id = v4();
    this.players = {
      [host.id]: {
        name: host.name,
        playingAs: startingPlayer ? 'p1' : 'p2',
      },
      [peer.id]: {
        name: peer.name,
        playingAs: startingPlayer ? 'p2' : 'p1',
      },
    };
    this.currentPlayer = startingPlayer ? host.id : peer.id;
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

  async update(userId: string, col: number) {
    if (this.validate(userId, col)) {
      const board = this.board.map((column) => [...column]);
      const row = board[col].indexOf(null);

      const position = { col, row };

      board[col][row] = {
        id: v4(),
        player: this.players[this.currentPlayer],
        position,
      };

      this.board = board;

      this.currentPlayer = Object.keys(this.players).filter(
        (playerId) => playerId !== this.currentPlayer,
      )[0];

      return {
        currentPlayer: this.currentPlayer,
        board: this.board,
        gameOver: this.gameOver,
      };
    }
  }

  validate(userId, col) {
    if (userId === this.currentPlayer) {
      return false;
    }

    // check game is not over and board is not full
    return true;
  }
}
