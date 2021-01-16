export class TicTacTrains {

    constructor(rulesType=1) {
        this.board = (new Array(TicTacTrains.ROWS * TicTacTrains.COLUMNS)).fill(false);
        this.valid = (new Array(TicTacTrains.ROWS * TicTacTrains.COLUMNS)).fill(false);
        this.move = 0;
        switch (rulesType) {
            case 2:
                this.rules = TicTacTrains.RULES_MODERN;
                break;
            case 3:
                this.rules = TicTacTrains.RULES_EXPERIMENTAL;
                break;
            default:
                this.rules = TicTacTrains.RULES_CLASSICAL;
                break;
        }
    }

    update = (ttt) => {
        this.board = Array.from(ttt.board);
        this.valid = Array.from(ttt.valid);
        this.move = ttt.move;
    }

    makeMove = (index, player) => {
        if (!this.isFinished() && this.isValid(index, player)) {
            this.board[index] = player;
            this.valid[index] = true;
            this.move++;
            return true;
        }
        return false;
    }

    score = () => {
        let xScore = 0, oScore = 0;
        for (let i = 0; i < TicTacTrains.ROWS * TicTacTrains.COLUMNS; i++) {
            if (!this.isEmpty(i)) {
                let checked = (new Array(TicTacTrains.ROWS*TicTacTrains.COLUMNS)).fill(false);
                let sqScore = this.longestPath(i, checked);
                if (this.board[i] && sqScore > xScore) xScore = sqScore;
                else if (!this.board[i] && sqScore > oScore) oScore = sqScore;
            }
        }
        return xScore - oScore;
    }

    getPlayer = () => {
        return !this.isFinished() 
            && this.rules[this.move].player;
    }

    getPolicy = () => {
        return !this.isFinished() && this.rules[this.move].policy;
    }

    isFinished = () => {
        return this.move >= TicTacTrains.ROWS * TicTacTrains.COLUMNS;
    }

    isEmpty = (index) => {
        return this.isIndexValid(index) && !this.valid[index];
    }

    isValid = (index, player) => {
        return this.isEmpty(index) && this.getPlayer() === player && this.getPolicy().has(index);
    }

    isIndexValid = (index) => {
        return index >= 0 && index < TicTacTrains.ROWS*TicTacTrains.COLUMNS;
    }

    getIndexString = (index) => {
        return (this.isIndexValid(index) && !this.isEmpty(index)) ? this.board[index] 
            ? "X" : "O" : " ";
    }

    longestPath = (i, checked) => {
        if (!this.isIndexValid(i)) return 0;
        let lh = 0, rh = 0, th = 0, bh = 0;
        let piece = this.board[i];
        checked[i] = true;
        if (i % TicTacTrains.COLUMNS > 0 
            && !this.isEmpty(i-1) 
            && this.board[i-1] === piece
            && !checked[i-1]) {
            lh += this.longestPath(i-1, checked);
        }
        if (i % TicTacTrains.COLUMNS < TicTacTrains.COLUMNS-1 
            && !this.isEmpty(i+1) 
            && this.board[i+1] === piece
            && !checked[i+1]) {
            rh += this.longestPath(i+1, checked);
        }
        if (i >= TicTacTrains.COLUMNS 
            && !this.isEmpty(i-TicTacTrains.COLUMNS) 
            && this.board[i-TicTacTrains.COLUMNS] === piece
            && !checked[i-TicTacTrains.COLUMNS]) {
            th += this.longestPath(i-TicTacTrains.COLUMNS, checked);
        }
        if (i < TicTacTrains.ROWS*(TicTacTrains.COLUMNS-1) 
            && !this.isEmpty(i+TicTacTrains.COLUMNS) 
            && this.board[i+TicTacTrains.COLUMNS] === piece
            && !checked[i+TicTacTrains.COLUMNS]) {
            bh += this.longestPath(i+TicTacTrains.COLUMNS, checked);
        }
        checked[i] = false;
        return 1 + Math.max(lh, rh, th, bh);
    }

    toString = () => {
        let stateString = "";
        for (let i = 0; i < TicTacTrains.ROWS*TicTacTrains.COLUMNS; i++) {
            if ((i+1)%TicTacTrains.ROWS === 0) {
                stateString += "[" + this.getStateString(i) + "]\n";
            } else {
                stateString += "[" + this.getStateString(i) + "]";
            }
        }
        return stateString;
    }

    static ROWS = 7;
    static COLUMNS = 7;

    static PLAYER = {
        X: true,
        O: false,
    }

    static ALL_INDICES = new Set([
         0, 1, 2, 3, 4, 5, 6,
         7, 8, 9,10,11,12,13,
        14,15,16,17,18,19,20,
        21,22,23,24,25,26,27,
        28,29,30,31,32,33,34,
        35,36,37,38,39,40,41,
        42,43,44,45,46,47,48,
    ]);

    static RING1_INDICES = new Set([
        0, 1, 2, 3, 4, 5, 6,
        7, 8, 9,10,11,12,13,
       14,15,16,17,18,19,20,
       21,22,23,   25,26,27,
       28,29,30,31,32,33,34,
       35,36,37,38,39,40,41,
       42,43,44,45,46,47,48,
    ]);

    static RING1_I_INDICES = new Set([
  

             16,17,18,
             23,24,25,
             30,31,32,


    ]);

    static RING2_INDICES = new Set([
        0, 1, 2, 3, 4, 5, 6,
        7, 8, 9,10,11,12,13,
       14,15,         19,20,
       21,22,         26,27,
       28,29,         33,34,
       35,36,37,38,39,40,41,
       42,43,44,45,46,47,48,
    ]);

    static RING3_INDICES = new Set([
        0, 1, 2, 3, 4, 5, 6,
        7,               13,
       14,               20,
       21,               27,
       28,               34,
       35,               41,
       42,43,44,45,46,47,48,
    ]);

    static POLICY = {
        ALL: TicTacTrains.ALL_INDICES,
        RING1: TicTacTrains.RING1_INDICES,
        RING1_I: TicTacTrains.RING1_I_INDICES,
        RING2: TicTacTrains.RING2_INDICES,
        RING3: TicTacTrains.RING3_INDICES,
    }

    static RULES_CLASSICAL = [
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
    ];

    static RULES_MODERN = [
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.RING1_I}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.RING3}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},
    ];

    static RULES_EXPERIMENTAL = [
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.RING2}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.RING3}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},

        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 

        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.X, policy: TicTacTrains.POLICY.ALL}, 
        {player: TicTacTrains.PLAYER.O, policy: TicTacTrains.POLICY.ALL},
    ];

}
