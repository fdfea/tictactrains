import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

import { TicTacTrains } from './tictactrains.js';

export class TicTacTrainsState extends Schema {

    @type({map: "boolean"}) players = new MapSchema<boolean>();

    @type(["boolean"]) 
    board: boolean[] = (new ArraySchema<boolean>())
        .fill(false, 0, TicTacTrains.ROWS*TicTacTrains.COLUMNS);

    @type(["boolean"]) 
    valid: boolean[] = (new ArraySchema<boolean>())
        .fill(false, 0, TicTacTrains.ROWS*TicTacTrains.COLUMNS);

    @type("number") 
    move: number = 0;

    update(ttt: TicTacTrains): void {
        this.board = ArraySchema.from(ttt.board.slice());
        this.valid = ArraySchema.from(ttt.valid.slice());
        this.move = ttt.move;
    }

}
