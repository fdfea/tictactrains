import React from "react";

import { TicTacTrains } from "./tictactrains.js";
import { TicTacTrainsBoard } from "./TicTacTrainsBoard.js";

import "./App.css";

export class LocalGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            game: new TicTacTrains(),
            score: null,
        };
    }

    componentDidMount = () => {
        if (this.props.config) {
            this.loadConfig(this.props.config);
        }
    }

    loadConfig = (config) => {
        const rulesType = config.rules;
        this.setState({game: new TicTacTrains(rulesType)});
    }

    handleClick = (index) => {
        if (this.state.game.makeMove(index, this.state.game.getPlayer())) {
            const newState = this.state;
            if (this.state.game.isFinished()) {
                newState.score = this.state.game.score();
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
