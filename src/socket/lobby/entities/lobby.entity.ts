import { User } from '@/common/interfaces';
import { v4 } from 'uuid';
import { Game } from './game.entity';

export class Lobby {
  public id: string;
  public host: User;
  public peer: User;
  public game: Game | null;

  constructor() {
    this.id = v4();
  }

  setHost(user: User) {
    this.host = user;
  }

  setPeer(user: User) {
    this.peer = user;
  }

  newGame() {
    this.game = new Game(~~(Math.random() * 2), this.host, this.peer);
  }
}
