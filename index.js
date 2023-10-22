import { createServer } from "node:http";
import handler from "./handler.js";
import { Server } from "socket.io";

const PORT = process.env.PORT || 8080;

const server = createServer(handler).listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});
