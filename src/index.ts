import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./configs/db.config";
import { idea_router } from "./features/ideas/routes/idea.route";
const app: Express = express();
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
app.use(cors());
// const server = http.createServer(app);

connectDB();

// const io = new Server(server, {
//   cors: {},
// });
app.use(express.json());
const port = process.env.PORT || 5000;

app.use("/api/idea", idea_router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("User Disconnected");
//   });
//   socket.on("example_message", (msg) => {
//     console.log("message: " + msg);
//   });
// });
// server.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });
