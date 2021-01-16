import React from 'react';
import * as Colyseus from 'colyseus.js';

import { TicTacTrains } from './tictactrains.js';
import { TicTacTrainsBoard } from './TicTacTrainsBoard.js';

import './App.css';

//($env:HTTPS = "true") -and (npm start)
const WS = "ws://localhost:5000";
//const WS = 'wss://localhost:5000';
//const WS = 'wss://91987daff954.ngrok.io';
const client = new Colyseus.Client(WS);

export class OnlineGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            game: new TicTacTrains(),
            room: null,
            score: null,
        };
    }

    componentDidMount = () => {
        if (this.props.config) {
            this.loadConfig(this.props.config);
        }
    }

    componentWillUnmount = () => {
        if (this.state.room) {
            this.state.room.leave();
        }
    }

    loadConfig = (config) => {
        const rulesType = config.rules;
        const playerType = config.player;
        client.create("tictactrains", {rulesType: rulesType, playerType: playerType}).then(room => {
            this.acquireRoom(room);
        }).catch(e => {
            console.error("Room create error", e);
        });
    }

    acquireRoom = (room) => {
        console.log("Room joined successfully", room);
        this.setState({room}, () => {
            this.state.room.onStateChange(game => {
                this.state.game.update(game);
                this.setState(this.state);
            });
            this.state.room.onMessage("finished", (score) => {
                this.setState({score: "Score: " + score});
            });
        });
    }

    tryJoinRoom = (roomId) => {
        client.joinById(roomId).then(room => {
            this.acquireRoom(room);
        }).catch(e => {
            console.error("Room join error", e);
        });
    }

    handleClick = (index) => {
        if (this.state.room) {
            this.state.room.send("move", {index});
        }
    }

    render = () => {
        const score = (this.state.score) ? <p>{this.state.score}</p> : null;
        const lobby = (!this.state.room || score) ? <LobbyList tryJoinRoom={this.tryJoinRoom}/> : null;
        return (
            <div>
                <div className="game">
                    {score}
                    <TicTacTrainsBoard
                        handleClick={this.handleClick}
                        getIndexString={this.state.game.getIndexString}
                    />
                </div>
                {lobby}
            </div>
        );
    }

}

const LobbyRoomButton = (props) => {
    let rules, player;
    console.log("Rules: " + props.rules);
    console.log("Player: " + props.player);
    switch (props.rules) {
        case 1: rules = "Classical"; break;
        case 2: rules = "Modern"; break;
        case 3: rules = "Experimental"; break;
        default: rules = ""; break;
    }
    switch (props.player) {
        case 0: player = "X"; break;
        case 1: player = "O"; break;
        case 2: player = "?"; break;
        default: player = ""; break;
    }
    console.log("Rules: " + rules + ", Player: " + player);
    return (
        <button className="room-button" onClick={props.onClick}>
            <strong>Room Id: </strong>{props.roomId},
            <strong> Rules: </strong>{rules},
            <strong> Player: </strong>{player}
        </button>
    );
}

const LOBBY_UPDATE_INTERVAL_MS = 3000;

class LobbyList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
        };
        this.timer = null;
    }

    componentDidMount = () => {
        this.timer = setInterval(() => this.getLobby(), LOBBY_UPDATE_INTERVAL_MS);
    }

    componentWillUnmount = () => {
        clearInterval(this.timer);
    }

    handleClick = (roomId) => {
        this.props.tryJoinRoom(roomId);
    }

    getLobby = () => {
        let rooms = [];
        client.getAvailableRooms("tictactrains").then(newRooms => {
            newRooms.forEach(room => {
                console.log(room.roomId, room.clients, room.maxClients, room.metadata);
                rooms.push(room);
            });
            this.setState({rooms});
        }).catch(e => {
            console.error("Error getting available rooms", e);
        });
    }

    render = () => {
        const rooms = (!this.state.rooms || !this.state.rooms.length)
            ? <p>{"No rooms available right now, try creating a new one!"}</p>
            : this.state.rooms.map(room => 
                <LobbyRoomButton
                    key={room.roomId}
                    roomId={room.roomId}
                    rules={room.metadata.rulesType}
                    player={room.metadata.playerType}
                    onClick={() => this.handleClick(room.roomId)}
                />
            );
        return (
            <div className="vertical-list">
                <h3>Lobby</h3>
                {rooms}
            </div>
        );
    }

}
