import { User } from '@/common/interfaces';
import { v4 } from 'uuid';

export class Game {
  public id: string;
  public p1: User;
  public p2: User;
  public currentPlayer: string;

  constructor(p1: User, p2: User) {
    this.id = v4();
    this.p1 = p1;
    this.p2 = p2;
    this.currentPlayer = 'p1';
  }
}
