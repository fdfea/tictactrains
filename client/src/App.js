import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Navbar, Nav/*, Button*/ } from "react-bootstrap";

import { ConfigForm } from "./ConfigForm.js";
import { LocalGame } from "./LocalGame.js";
import { ComputerGame } from "./ComputerGame.js";
import { OnlineGame } from "./OnlineGame.js";
import { About } from "./About.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class SubsetMap extends Map {

    static of(entries) {
        const map = new SubsetMap();
        entries.forEach(entry => {
            map.set(entry[0], entry[1]);
        });
        return map;
    }

    getSubsetOfValues = (keys) => {
        return keys.filter(key => this.has(key)).map(key => this.get(key));
    }

    getSubsetOfEntries = (keys) => {
        const obj = {}
        keys.forEach(key => {
            if (this.has(key)) obj[key] = this.get(key);
        });
        return obj;
    }
    
}

const TTT_GAME_TYPE_LOCAL = "local";
const TTT_GAME_TYPE_COMPUTER = "computer";
const TTT_GAME_TYPE_ONLINE = "online";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            config: null,
            type: TTT_GAME_TYPE_LOCAL,
            keys: this.getConfigKeys(TTT_GAME_TYPE_LOCAL),
            count: 0,
        };
    }

    loadConfig = (config) => {
        this.setState({config, count: this.state.count + 1});
    }

    updateConfigKeys = (type) => {
        this.setState({config: null, type, keys: this.getConfigKeys(type)});
    }

    render() {
        return (
            <div className="app">
                <Navbar bg="dark" variant="dark">
                    {/*<Navbar.Brand as={Link} to="/">TicTacTrains</Navbar.Brand>*/}
                    <Navbar.Brand as={Link} to="/">
                        <img src="/brand.png" width="32" height="32" alt="TicTacTrains"/>
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                    </Nav>
                    {/*<Button variant="success">Login</Button>*/}
                </Navbar>

                <Switch>
                    <Route exact path="/">
                        <div className="main">
                            {this.getGameComponent(this.state.type)}
                            <ConfigForm
                                key={this.state.type}
                                loadConfig={this.loadConfig}
                                defaultState={App.defaultStates.getSubsetOfEntries(this.state.keys)}
                                configOpts={App.configOpts.getSubsetOfValues(this.state.keys)}
                                updateConfigKeys={this.updateConfigKeys}
                                updateKeysLabel="type"
                                updateKeysValue={this.state.type}
                                submitLabel="New Game"
                            />
                        </div>
                    </Route>
                    <Route exact path="/about" component={About}/>
                    <Route render={() => {
                        return <p>Not found</p>
                    }}/>
                </Switch>
            </div>
        );
    }

    getGameComponent = (type) => {
        let game;
        switch (type) {
            case TTT_GAME_TYPE_COMPUTER: {
                game = 
                    <ComputerGame
                        key={this.state.count}
                        config={this.state.config}
                    />;
                break;
            }
            case TTT_GAME_TYPE_ONLINE: {
                game = 
                    <OnlineGame
                        key={this.state.count}
                        config={this.state.config}
                    />;
                break;
            }
            default: {
                game = 
                    <LocalGame
                        key={this.state.count}
                        config={this.state.config}
                    />;
                break;
            }
        }
        return game;
    }

    getConfigKeys = (type) => {
        let keys;
        switch (type) {
            case TTT_GAME_TYPE_COMPUTER: {
                keys = ["type", "rules", "player", "simulations", "algorithm", "policy", "strategy"];
                break;
            }
            case TTT_GAME_TYPE_ONLINE: {
                keys =["type", "rules", "player"];
                break;
            }
            default: {
                keys = ["type", "rules"];
                break;
            }
        }
        return keys;
    }

    static defaultStates = SubsetMap.of([
        ["type", TTT_GAME_TYPE_LOCAL], 
        ["rules", 1], 
        ["player", 0], 
        ["simulations", 1000], 
        ["algorithm", 1], 
        ["policy", 1], 
        ["strategy", 1],
    ])

    static configOpts = SubsetMap.of([
        ["type", {
            name: "type",
            label: "Game Type",
            options: [
                {label: "Local", value: TTT_GAME_TYPE_LOCAL},
                {label: "Computer", value: TTT_GAME_TYPE_COMPUTER},
                {label: "Online", value: TTT_GAME_TYPE_ONLINE},
            ],
        }], 
        ["rules", {
            name: "rules",
            label: "Rules",
            options: [
                {label: "Classical", value: 1},
                {label: "Modern", value: 2},
                {label: "Experimental", value: 3},
            ],
        }], 
        ["player", {
            name: "player",
            label: "Player",
            options: [
                {label: "X", value: 0},
                {label: "O", value: 1},
                {label: "Random", value: 2},
            ],
        }], 
        ["simulations", {
            name: "simulations",
            label: "Difficulty",
            options: [
                {label: "Very Easy", value: 100},
                {label: "Easy", value: 1000},
                {label: "Medium", value: 5000},
                {label: "Hard", value: 10000},
                {label: "Very Hard", value: 20000}
            ],
        }], 
        ["algorithm", {
            name: "algorithm",
            label: "Scoring Algorithm",
            options: [
                {label: "Optimal", value: 1},
                {label: "Quick", value: 2},
            ],
        }], 
        ["policy", {
            name: "policy",
            label: "Prediction Policy",
            options: [
                {label: "Never", value: 1},
                {label: "Always", value: 2},
                {label: "Long Paths", value: 3},
            ],
        }], 
        ["strategy", {
            name: "strategy",
            label: "Prediction Strategy",
            options: [
                {label: "Linear Regression", value: 1},
                {label: "Logistic Regression", value: 2},
                {label: "Neural Network", value: 3},
            ],
        }], 
    ]);

}
