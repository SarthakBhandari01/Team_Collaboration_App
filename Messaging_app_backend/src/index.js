import cors from "cors";
import express from "express";
import { createServer } from "http";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";

import connectDB from "./config/dbConfig.js";
import { PORT } from "./config/serverConfig.js";
import channelHandler from "./controllers/channelSocketController.js";
import dmMessageHandler from "./controllers/dmSocketController.js";
import messageHandler from "./controllers/messageSocketController.js";
import apiRouter from "./routes/apiRouter.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: "pong",
  });
});

app.use("/api", apiRouter); //if the url starts with "/api" then the request is forwarded to apiRouter.

io.on("connection", (socket) => {
  messageHandler(io, socket);
  channelHandler(io, socket);
  dmMessageHandler(io, socket);
});

server.listen(PORT, async () => {
  console.log("server running on port ", PORT);
  connectDB();
});
