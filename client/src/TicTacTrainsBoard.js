import React from 'react';

import { TicTacTrains } from "./tictactrains.js";

import './App.css';

const Square = (props) => {
    return (
        <button className="square" onClick={props.onClick}>
            {props.data}
        </button>
    );
}

export const TicTacTrainsBoard = (props) => {
    const board = [];
    for (let row = 0; row < TicTacTrains.ROWS; row++) {
        const boardRow = [];
        for (let col = 0; col < TicTacTrains.COLUMNS; col++) {
            const index = TicTacTrains.ROWS*row + col;
            boardRow.push(
                <Square
                    key={index}
                    data={props.getIndexString(index)}
                    onClick={() => props.handleClick(index)}
                />
            );
        }
        board.push(
            <div className="board-row" key={row}>
                {boardRow}
            </div>
        );
    }
    return ( 
        <div>{board}</div>
    );
}
