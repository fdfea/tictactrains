import React from "react";

import "./App.css"

export class About extends React.Component {

    render = () => {
        return (
            <div className="about">
            <h1 id="-about-tictactrains-"><strong>About TicTacTrains</strong></h1>
            <ol>
            <li><a href="#-game-rules-mechanics-">Game Rules/Mechanics</a></li>
            <li><a href="#-website-usage-">Website Usage</a></li>
            <li><a href="#-technical-explanation-">Technical Explanation</a></li>
            <li><a href="#-credits-">Credits</a></li>
            </ol>
            <h3 id="-game-rules-mechanics-"><strong>Game Rules/Mechanics</strong></h3>
            <p>TicTacTrains is an abstract strategy game that has been likened to a combination of the popular pencil-and-paper games Tic-Tac-Toe and Dots and Boxes. Two players take turns placing pieces on the 7x7 board until all the squares are filled. The first player&#39;s pieces are <code>X</code>&#39;s and the second player&#39;s pieces are <code>O</code>&#39;s. The goal is to create a longer train of pieces than your opponent, connected horizontally and vertically, but not diagonally. If both players&#39; longest train is the same length, the game ends in a draw. Once a player places a piece on a square, that piece is locked for the remainder of the game, and a piece cannot be placed on a square that is already occupied. An example of a finished board is depicted below. </p>
            <pre><code>7 [<span>X</span>][<span>X</span>][<span>O</span>][<span>X</span>][<span>O</span>][<span>O</span>][<span>O</span>]<br/>
            6 [<span>X</span>][<span>X</span>][<span>O</span>][<span>O</span>][<span>X</span>][<span>X</span>][<span>X</span>]<br/>
            5 [<span>O</span>][<span>O</span>][<span>O</span>][<span>O</span>][<span>O</span>][<span>O</span>][<span>X</span>]<br/>
            4 [<span>X</span>][<span>O</span>][<span>O</span>][<span>X</span>][<span>X</span>][<span>X</span>][<span>O</span>]<br/>
            3 [<span>X</span>][<span>X</span>][<span>X</span>][<span>X</span>][<span>X</span>][<span>O</span>][<span>O</span>]<br/>
            2 [<span>O</span>][<span>X</span>][<span>O</span>][<span>X</span>][<span>O</span>][<span>X</span>][<span>O</span>]<br/>
            1 [<span>X</span>][<span>X</span>][<span>X</span>][<span>O</span>][<span>O</span>][<span>X</span>][<span>O</span>]<br/>
            &amp;  a  b  c  d  e  f  g
            </code></pre><p>In this game, <code>O</code> won because they achieved a path length of 10, while <code>X</code> achieved a path length of only 9. The order of the moves in this game went as follows: </p>
            <pre><code> <span>1</span>. <span>d4</span> <span>d5</span>   <span>2</span>. e4 <span>c4</span>   <span>3</span>. <span>d3</span> e5<br/>
            <span> 4</span>. <span>f4</span> <span>c5</span>   <span>5</span>. <span>c3</span> <span>f5</span>   <span>6</span>. <span>b3 </span><span>b4<br/>
            </span> <span>7</span>. g5 g4   <span>8</span>. <span>a4</span> <span>f3</span>   <span>9</span>. <span>f6</span> <span>b5<br/>
            </span><span>10</span>. <span>b6 </span>a5  <span>11</span>. a6 e2  <span>12</span>. <span>b2 </span><span>d6</span><br/>
            <span>13</span>. e6 <span>c2</span>  <span>14</span>. <span>a3</span> <span>a2</span>  <span>15</span>. <span>b1 </span><span>c6</span><br/>
            <span>16</span>. <span>c1</span> <span>d1</span>  <span>17</span>. <span>d7</span> <span>c7</span>  <span>18</span>. <span>b7 </span>e1<br/>
            <span>19</span>. <span>d2</span> g3  <span>20</span>. e3 e7  <span>21</span>. <span>a1</span> g7<br/>
            <span>22</span>. <span>f2</span> g2  <span>23</span>. <span>f1</span> g1  <span>24</span>. a7 <span>f7</span><br/>
            <span>25</span>. g6
            </code></pre><p>As you can see, <code>X</code> and <code>O</code> alternated moving once on each turn. However, the game also allows for the rules to be modified, by way of the order of the players&#39; turns and the squares available to move on. For example, <code>X</code> might go first wherever they want and then <code>O</code> might go twice, but on their second move only be allowed to go in the outer ring of the board, depicted below. </p>
            <pre><code><span>1. </span>d4 d5 g4   2. c4 e4<br/>
            7 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            6 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            5 [<span> </span>][<span> </span>][<span> </span>][<span>O</span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            4 [<span> </span>][<span> </span>][<span>X</span>][<span>X</span>][<span>O</span>][<span> </span>][<span>O</span>]<br/>
            3 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            2 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            1 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            &amp;  a  b  c  d  e  f  g
            </code></pre><p>When the rules only allow a player to make a move in certain squares, the board is generally split into three rings (<code>1</code>, <code>2</code>, and <code>3</code>), shown below. Usually a player&#39;s movement is restricted only in the opening of the game (the first 3 turns or so). </p>
            <pre><code>7 [<span>3</span>][<span>3</span>][<span>3</span>][<span>3</span>][<span>3</span>][<span>3</span>][<span>3</span>]<br/>
            6 [<span>3</span>][<span>2</span>][<span>2</span>][<span>2</span>][<span>2</span>][<span>2</span>][<span>3</span>]<br/>
            5 [<span>3</span>][<span>2</span>][<span>1</span>][<span>1</span>][<span>1</span>][<span>2</span>][<span>3</span>]<br/>
            4 [<span>3</span>][<span>2</span>][<span>1</span>][<span>1</span>][<span>1</span>][<span>2</span>][<span>3</span>]<br/>
            3 [<span>3</span>][<span>2</span>][<span>1</span>][<span>1</span>][<span>1</span>][<span>2</span>][<span>3</span>]<br/>
            2 [<span>3</span>][<span>2</span>][<span>2</span>][<span>2</span>][<span>2</span>][<span>2</span>][<span>3</span>]<br/>
            1 [<span>3</span>][<span>3</span>][<span>3</span>][<span>3</span>][<span>3</span>][<span>3</span>][<span>3</span>]<br/>
            &amp;  a  b  c  d  e  f  g
            </code></pre><p>A few rule sets are provided. The default is <code>Classical</code> rules, which is notated as <code>(XA, OA, ...)</code>. This means that each player alternates on every turn and can go in any square, hence the <code>A</code>. the second rule set provided is <code>Modern</code> rules, which is notated as <code>(XA, O1, O3, XA, OA, ...)</code>. This means that <code>X</code> goes once anywhere, <code>O</code> goes twice (once in ring <code>1</code> and once in ring <code>3</code>), and then the players alternate for the rest of the game, going wherever is available. The final rule set provided is <code>Experimental</code> rules, notated as <code>(XA, O2, O3, XA, OA, ...)</code>. </p>
            <h3 id="-website-usage-"><strong>Website Usage</strong></h3>
            <p>This website allows you to play TicTacTrains locally (two players on the same computer), against the AI engine in your browser, or online (you against another player remotely). When first navigating to the web page, use the <code>Game Type</code> drop-down list to select which type of game you would like to play. After selecting the game type, you can use the other drop-down lists to configure your game, e.g. which rule set to use or which player to be. Once you have your desired settings, click the <code>New Game</code> button above the configuration menu to start your game. When it is your turn to make a move, simply click the square on the board that you would like to move on. If your move is valid, the board will show that you have claimed that square. When the game is finished the score will be displayed below the screen and you can create a new game to play again. When playing against the AI opponent, the computer will automatically make its move after you have finished your turn, but in some cases you may need to wait a second or two for it to display the moves. For online games, you can join an existing game by scrolling down and clicking on one of the challenges in the lobby if any are available. Alternatively, you can issue a new challenge by clicking <code>New Game</code> from the configuration menu, and the game will begin when someone has accepted your challenge. </p>
            <h3 id="-technical-explanation-"><strong>Technical Explanation</strong></h3>
            <h5 id="-tech-stack-"><strong>Tech Stack</strong></h5>
            <p>All of the source code for the application is available on GitHub <a href="https://github.com/fdfea/tictactrains" target="_blank" rel="noreferrer noopener">here</a>.</p>
            <p>The front-end of the website was built using <a href="https://reactjs.org/" target="_blank" rel="noreferrer noopener">React</a>. Routing is handled with <a href="https://reactrouter.com/" target="_blank" rel="noreferrer noopener">React Router</a> and the user interface was supplemented with <a href="https://react-bootstrap.github.io/" target="_blank" rel="noreferrer noopener">React Bootstrap</a>. The website is served from an <a href="https://expressjs.com/" target="_blank" rel="noreferrer noopener">Express</a> server. The networking and online game state management was simplified with <a href="https://colyseus.io/" target="_blank" rel="noreferrer noopener">Colyseus</a>. Additionally, the client and server web applications made use of the <a href="https://nodejs.org/en/" target="_blank" rel="noreferrer noopener">Node</a> and <a href="https://www.npmjs.com/" target="_blank" rel="noreferrer noopener">NPM</a> development environment and the <a href="https://www.javascript.com/" target="_blank" rel="noreferrer noopener">JavaScript</a> and <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer noopener">TypeScript</a> programming languages. The game engine and AI was implemented with the <a href="https://www.gnu.org/software/gnu-c-manual/" target="_blank" rel="noreferrer noopener">C</a> programming language, and then compiled to <a href="https://webassembly.org/" target="_blank" rel="noreferrer noopener">WebAssembly</a> using <a href="https://emscripten.org/" target="_blank" rel="noreferrer noopener">Emscripten</a> to run in a web browser. The machine learning for the AI was implemented with the <a href="https://www.python.org/" target="_blank" rel="noreferrer noopener">Python</a> programming language, with the <a href="https://scikit-learn.org/stable/" target="_blank" rel="noreferrer noopener">scikit-learn</a> library for modeling and the <a href="https://pandas.pydata.org/" target="_blank" rel="noreferrer noopener">pandas</a> library for data manipulation. </p>
            <h5 id="-explanation-of-ai-"><strong>Explanation of AI</strong></h5>
            <p>The artificially intelligent opponent uses the Monte Carlo Tree Search algorithm. Essentially, it works by expanding a search tree from the current game state. The AI strategically works its way down the tree until it finds a leaf node and then expands the node&#39;s children. Then it simulates a playout from one of the new nodes and propagates the result back up to the root of the tree. It repeats this process for a given number of simulations. The tree looks like a minimax tree, but the nodes with the best score are explored more, and the root child with the most visits is ultimately the one that the AI chooses. This allows the AI to avoid exploring nodes that are statistically unlikely to be good, saving a lot of time compared to minimax. You will find that the AI is very strong with 10000 or more simulations per move, taking an average of about 400 ms on my machine, when optimal scoring and sufficient compiler optimizations are used. </p>
            <p>The search tree can also get rather large when a high number of simulations are used. This is one of the main reasons I used C to implement the game, as I was able to condense each search tree node into a minimum of 31 bytes, which makes the size of the tree negligible for just about any device or use case. </p>
            <p>However, when the paths get long during the game (longer than about 12 pieces), the engine can get rather slow because the simulation scoring algorithm is technically NP-hard (longest path problem). To combat this, I implemented a few machine learning models to predict the outcome of a simulation, namely linear regression, logistic regression, and a neural network regressor. The linear and logistic regression models predict the score of a board using the number of pieces in a given board area and the neighbor count of each square (0-4). For example, a given board area might look something like:</p>
            <pre><code>7 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            6 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            5 [<span> </span>][<span> </span>][<span>X</span>][<span> </span>][<span>X</span>][<span>X</span>][<span> </span>]<br/>
            4 [<span> </span>][<span>X</span>][<span>X</span>][<span>X</span>][<span>X</span>][<span>X</span>][<span> </span>]<br/>
            3 [<span> </span>][<span> </span>][<span> </span>][<span>X</span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            2 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            1 [<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>][<span> </span>]<br/>
            &amp;  a  b  c  d  e  f  g
            </code></pre><p>There are 9 pieces in this board area, and each piece is associated with its neighbors by counting the number of pieces that are directly adjacent (left, right, top, or bottom). The linear regression model finds all the board areas for each player, predicts the longest path through each board area, and determines a winner by deciding which player had the longest predicted path. The logistic regression model finds the best board area for each player using linear regression, uses a logistic model to compare the two best areas, and then returns its evaluation of which player is most likely to be the winner. With these regression models I achieved an accuracy of about 87-93% (in terms of mean absolute error in path length prediction and predicted win versus true win, respectively).</p>
            <p>The multilayer perceptron neural network regressor predicts the outcome of a game by looking at the shape of all the board areas for each player. The shape is determined by looking at each square in the area and the 8 surrounding squares. The model classifies each square in a board area into one of 33 shapes and does this for each square in each area. Then the data is fed into the neural network, which outputs the predicted path length of each area. The longest predicted paths for each player are compared to determine the winner. I achieved about 95% accuracy (in terms of mean absolute error in predicted path length) with this method. </p>
            <p>The models were each trained with millions of randomly simulated games. They make the AI faster and no longer scale with path length, but are less accurate when a high degree of precision is needed (in the endgame) as a result of the models&#39; criteria for a win being slightly different than the true criteria due to information loss during feature extraction. I will also note that it not expected that these models would be extremely accurate because the problem for scoring the game is NP-hard, so you wouldn&#39;t expect that there would be a way to do it with extreme accuracy in much less time. </p>
            <h3 id="-credits-"><strong>Credits</strong></h3>
            <p>Developer and Creator - Forrest Feaser (<a href="https://github.com/fdfea" target="_blank" rel="noreferrer noopener">@fdfea</a>)</p>
            </div>
        );
    }

}
