import { User } from '@/common/interfaces';
import { v4 } from 'uuid';

export class Lobby {
  public id: string;
  public host: User;
  public peer: User;

  constructor() {
    this.id = v4();
  }

  public setHost(user: User) {
    this.host = user;
  }

  public setPeer(user: User) {
    this.peer = user;
  }
}
