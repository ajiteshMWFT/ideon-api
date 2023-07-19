"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_config_1 = require("./configs/db.config");
const idea_route_1 = require("./features/ideas/routes/idea.route");
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
// const server = http.createServer(app);
(0, db_config_1.connectDB)();
// const io = new Server(server, {
//   cors: {},
// });
app.use(express_1.default.json());
const port = process.env.PORT || 5000;
app.use("/api/idea", idea_route_1.idea_router);
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
