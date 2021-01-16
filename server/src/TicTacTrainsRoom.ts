import { Room, Client } from "colyseus";

import { TicTacTrainsState } from "./TicTacTrainsState";
import { TicTacTrains } from './tictactrains.js';

export class TicTacTrainsRoom extends Room<TicTacTrainsState> {

    ttt: TicTacTrains;
    player1: boolean;

    maxClients: number = 2;
    //patchRate: number = 50;

    onCreate(options: any): void {

        const rulesType = (options.rulesType) ? options.rulesType : 1;
        const playerType = (options.playerType) ? options.playerType : 0;
        this.player1 = (playerType === 2) 
            ? (Math.random() < 0.5) ? true : false
            : (playerType === 0) ? true : false;

        this.ttt = new TicTacTrains(rulesType);
        this.setState(new TicTacTrainsState());
        this.setMetadata({rulesType: rulesType, playerType: playerType});
        this.onMessage("move", (client: Client, data: any): void => {
            console.log("Click by: ", client.sessionId);
            const index: number = data.index;
            if (this.ttt.makeMove(index, this.state.players[client.sessionId]))
            {
                console.log("Moved at: " + index);
                this.state.update(this.ttt);
                if (this.ttt.isFinished()) {
                    const score: number = this.ttt.score();
                    console.log("Game finished: " + score);
                    this.broadcast("finished", score);
                }
            }
        });
        
    }

    onJoin(client: Client): void {
        if (this.clients.length === 1) {
            this.state.players[client.sessionId] = this.player1;
        } else if (this.clients.length === 2) {
            this.state.players[client.sessionId] = !this.player1;
        } else {
            console.log("Error connecting client");
        }
        if (this.clients.length >= this.maxClients) {
            this.lock();
        }
    }

    onLeave(client: Client, consented: boolean): void {
        console.log("Player left: " + client.sessionId);
    }

    onDispose(): void {
        console.log("Room disposed");
    }

}