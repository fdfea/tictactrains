# **TicTacTrains**

### **Table of Contents**
1. [Summary](#summary)
2. [Modules](#modules)
3. [Tech Stack](#tech-stack)
4. [Game Rules](#game-rules)
5. [Credits](#credits)

### **Summary**

A deployable, full-stack website to play the board game TicTacTrains against online opponents or an artificially intelligent agent. 

Try out the game [here](https://tictactrains.herokuapp.com/)!

### **Modules**

There are three modules that make up the application:  

* [Client](client/) – A React front-end which allows the user to interact with the board and configure game settings. 
* [Engine](engine/) – An implementation of the game rules and the AI opponent in C. 
* [Server](server/) – An Express/Colyseus server to matchmake and manage games between online opponents. 
* [Original](original/) – The original implementation of the game in Java and data generation for the models. 
* [Models](models/) – The Python models to predict the outcome of simulated games for the AI. 

### **Tech Stack**

The demo website is hosted on [Heroku](https://www.heroku.com/). The front-end of the website was built using [React](https://reactjs.org/). Routing is handled with [React Router](https://reactrouter.com/) and the user interface was supplemented with [React Bootstrap](https://react-bootstrap.github.io/). The website is served from an [Express](https://expressjs.com/) server. The networking and game state management for online games was simplified with [Colyseus](https://colyseus.io/). Additionally, the web application made use of the [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) development environments and the [JavaScript](https://www.javascript.com/) and [TypeScript](https://www.typescriptlang.org/) programming languages. The game engine and AI was implemented with the [C](https://www.gnu.org/software/gnu-c-manual/) programming language, and then compiled to [WebAssembly](https://webassembly.org/) using [Emscripten](https://emscripten.org/) to run in a web browser. The machine learning for the AI was implemented with the [Python](https://www.python.org/) programming language, using the [scikit-learn](https://scikit-learn.org/stable/) library for modeling, and the [pandas](https://pandas.pydata.org/) library for data manipulation. A more detailed explanation of the AI is available in the [engine](engine/README.md). 


### **Game Rules**

TicTacTrains is an abstract strategy game that has been likened to a combination of the popular pencil-and-paper games Tic-Tac-Toe and Dots and Boxes. 

Two players take turns placing pieces on a 7x7 board until all the squares are filled. The first player's pieces are X's and the second player's pieces are O's. The goal is to create a longer train of pieces than your opponent, connected horizontally and vertically, but not diagonally. If both players' longest train is the same length, the game ends in a draw. Once a player places a piece on a square, that piece is locked for the remainder of the game, and a piece cannot be placed on a square that is already occupied. The rules can be modified by way of the order of the players' turns and the squares available to move on. For a more detailed explanation of the game mechanics and rules, see the [engine](engine/README.md). 

### **Credits**

Developer and Creator - Forrest Feaser ([@fdfea](https://github.com/fdfea))
