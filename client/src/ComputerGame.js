import React from "react";
import Module from "./ttt.mjs";

import { TicTacTrains } from "./tictactrains.js";
import { TicTacTrainsBoard } from "./TicTacTrainsBoard.js";

import "./App.css";

let Engine;
Module().then(engine => {
    Engine = engine;
});

export class ComputerGame extends React.Component {

    static TTT_GAME_SIZE = 520;
    static TTT_CONFIG_SIZE = 24;

    constructor(props) {
        super(props);
        this.state = {
            game: new TicTacTrains(),
            pGame: null,
            player: null,
            score: null,
        };
    }

    componentDidMount = () => {
        if (this.props.config && Engine) {
            this.loadConfig(this.props.config);
        }
    }

    componentWillUnmount = () => {
        if (this.state.pGame && Engine) {
            Engine._ttt_free(this.state.pGame);
            Engine._free(this.state.pGame);
        }
    }

    loadConfig = (config) => {
        const rulesType = config.rules;
        const playerType = config.player;
        const simulations = config.simulations;
        const scoringAlgorithm = config.algorithm;
        const predictionPolicy = config.policy;
        const predictionStrategy = config.strategy;
        const player = (playerType === 2) 
            ? Math.random() < 0.5 
            : (playerType === 1) ? false : true;
        const game = new TicTacTrains(rulesType);
        const pGame = Engine._malloc(ComputerGame.TTT_GAME_SIZE);
        const pConfig = Engine._malloc(ComputerGame.TTT_CONFIG_SIZE);
        Engine._ttt_cfg_init(pConfig);
        Engine.setValue(pConfig + 4, rulesType, "i32");
        Engine.setValue(pConfig + 8, simulations, "i16");
        Engine.setValue(pConfig + 12, scoringAlgorithm, "i32");
        Engine.setValue(pConfig + 16, predictionPolicy, "i32");
        Engine.setValue(pConfig + 20, predictionStrategy, "i32");
        Engine._ttt_init(pGame, pConfig);
        Engine._free(pConfig);
        while (!Boolean(Engine._ttt_is_finished(pGame))
            && Boolean(Engine._ttt_get_player(pGame)) !== player) 
        {
            const index = Engine._ttt_get_ai_move(pGame);
            Engine._ttt_give_move(pGame, index)
            game.makeMove(index, !player);
        }
        this.setState({game, pGame, player});
    }

    handleClick = (index) => {
        if (Engine && this.state.pGame 
            && Boolean(Engine._ttt_get_player(this.state.pGame)) === this.state.player
            && Engine._ttt_give_move(this.state.pGame, index) === 0) 
        {
            this.state.game.makeMove(index, this.state.player);
            while (!Boolean(Engine._ttt_is_finished(this.state.pGame))
                && Boolean(Engine._ttt_get_player(this.state.pGame)) !== this.state.player)
            {
                const index = Engine._ttt_get_ai_move(this.state.pGame);
                Engine._ttt_give_move(this.state.pGame, index);
                this.state.game.makeMove(index, !this.state.player);
            }
            const newState = this.state;
            if (Boolean(Engine._ttt_is_finished(this.state.pGame))) {
                newState.score = Engine._ttt_get_score(this.state.pGame);
                Engine._ttt_free(this.state.pGame);
                Engine._free(this.state.pGame);
                newState.pGame = null;
            }
            this.setState(newState);
        }
    }

    render = () => {
        const score = (this.state.score) 
            ? <p className="score">Score: <span>{this.state.score}</span></p> 
            : null;
        return (
            <div className="game">
                {score}
                <TicTacTrainsBoard
                    handleClick={this.handleClick}
                    getIndexString={this.state.game.getIndexString}
                /> 
            </div>
        );
    }

}
