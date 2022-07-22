import { v4 } from 'uuid';
import { GameState, Board, Column, Coords, Player, Players, Options } from "../types/game.types";

const defaultState = {
    board: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [1, 1, 1, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
    ],
    currentPlayer: 0,
    gameOver: false
}

export class Game {
    id: string;
    state: GameState;
    move: Coords;
    players: Players;
    moveList: Array<Coords>;
    options: Options;

    constructor(players: Players, options: Options) {
        this.id = v4().slice(0, 8);
        this.state = defaultState;
        this.move = {
            col: null,
            row: null
        }
        this.moveList = [];
        this.players = players;
        this.options = options;
    }

    checkWin(id: string, col: number): GameState {
        try {
            const checks = this.checkPlayer(id) && this.checkMove(col) && !this.state.gameOver;
            console.log(checks)

            
            if (checks) {
                const board = this.copyBoard();
                const row = board[col].indexOf(null);
            
                board[col][row] = this.state.currentPlayer;
                this.move = { col, row };
                
                this.moveList.push(this.move);
        
                if (
                    this.checkVertical(board) ||
                    this.checkHorizontal(board) ||
                    this.checkRightDiagonal(board) ||
                    this.checkLeftDiagonal(board) ||
                    this.checkDraw(board)
                ) {
                    const { currentPlayer } = this.state;
                    const winner = this.getCurrentPlayer();
                    const loser = this.getWaitingPlayer(); 
                    this.state = {
                        ...this.state,
                        board,
                        winner,
                        loser,
                        gameOver: true,
                    }
                    
                    return this.state;
                } else {
                    const currentPlayer = this.switchPlayer();
                    this.state = {
                        ...this.state,
                        board,
                        currentPlayer,
                    }
        
                    return this.state;
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Win condition methods
    checkVertical = (board: Board): boolean => {
        const { col, row } = this.move;

        const minRow = this.min(row);

        if (row < 3) return false;

        return this.checkArray(board[col].slice(minRow, row + 1));
    }
    
    checkHorizontal(board: Board): boolean {
        const { col, row } = this.move;
        const minCol = this.min(col);
        const maxCol = this.max(col, 6)+1;
    
        for (let i = minCol, j = minCol + 4; j <= maxCol; i++, j++) {
            if (this.checkArray(board.slice(i, j).map((col) => col[row]))) {
                return true
            }
        }
        return false;
    }
    
    checkRightDiagonal(board: Board): boolean {
        for (let c = 0; c <= 3; c++) {
            for (let r = 0; r < 4; r++) {
                const segment = [board[c][r], board[c+1][r+1], board[c+2][r+2], board[c+3][r+3]];

                if (this.checkArray(segment)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    checkLeftDiagonal(board: Board): boolean {
        for (let c = 3; c <= 6; c++) {
            for (let r = 0; r < 4; r++) {
                const segment = [board[c][r], board[c-1][r+1], board[c-2][r+2], board[c-3][r+3]];

                if (this.checkArray(segment)) {
                    return true;
                }
            }
        }
        return false;
    }

    checkDraw(board: Board): boolean {
        return !board.flat().some(x => x === null)
    }

    // Player methods
    getCurrentPlayer(): Player {
        return this.players.find(
            (player) => player.position === this.state.currentPlayer
        );
    }
    
    getWaitingPlayer(): Player {
        return this.players.find(
            (player) => player.position !== this.state.currentPlayer
        );
    }

    switchPlayer(): number {
        return 3 - this.state.currentPlayer;
    };
    
    checkPlayer(id: string): boolean {
        return id === this.getCurrentPlayer().id;
    }

    // helpers
    checkMove(col: number): boolean {
        return this.state.board[col].includes(null);
    }

    checkArray(arr: Column): boolean {
        return arr.every((value) => value === arr[0] && value !== null);
    }

    copyBoard (): Board {
        return this.state.board.map(column => [...column]);
    };

    min(num: number): number {
        return Math.max(num - 3, 0);
    }

    max(num: number, max: number): number {
        return Math.min(num + 3, max) + 1;
    };
}