import { User } from '../interfaces';

export type Token = null | any;

export type Column = Array<Token>;

export type Board = Array<Column>;

export type Coords = {
  row: number;
  col: number;
};

export type Move = {
  user: User;
  coords: Coords;
};
