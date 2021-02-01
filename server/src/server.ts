import http from "http";
import path from "path";
import express from "express";
import favicon from "serve-favicon";
import { Server } from "colyseus";
/*
import cors from "cors";
import { monitor } from "@colyseus/monitor";
*/

import { TicTacTrainsRoom } from "./TicTacTrainsRoom";

const PORT = Number(process.env.PORT) || 5000;

const app = express();

/*
app.use(cors());
*/
app.use(express.json());
app.use(favicon(path.join(__dirname, "..", "..", "client", "build", "favicon.ico")));
app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

const server = http.createServer(app);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "build", "index.html"));
});

const gameServer = new Server({
    server: server, 
});

gameServer.define("tictactrains", TicTacTrainsRoom);

/*
app.use("/colyseus", monitor());
*/

gameServer.listen(PORT).then(() => {
    console.log(`Listening on port ${PORT}...`);
});
