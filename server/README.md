# **TicTacTrains Server**

### **Summary**

An Express server to serve the [client](../client/) application and to matchmake and manage the game state between players. 

### **Usage**

This module includes a separate package.json so it can be run on its own. Install the dependencies with `npm install`. Then, simply run `npm start` to run the express server locally. Assuming the build files from the client are available, the server will serve them. The server can also work without the build files available as long as the client is running somewhere locally accessible. Note: you may need to run `npm install cors` and uncomment the cors code and comment out the code which serves the build files in `server.ts`. Running `npm build` will build the client application (assuming the directory structure is the same as the root project). 
