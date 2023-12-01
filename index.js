import { createServer } from "node:http";
import handler from "./handler.js";
import { Server } from "socket.io";
import { writeMessage } from "./repositories/repositories.js";

const PORT = process.env.PORT || 8080;
let activeUsers = [];

const server = createServer(handler).listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Active users
  socket.on("user", (data) => {
    const existingUser = activeUsers.find((user) => user.user === data);
    if (!existingUser) {
      activeUsers.push({
        id: data,
        socketID: socket.id,
      });
      if (activeUsers.length > 1) io.emit("active", activeUsers);
    }
  });

  // Disconnected users
  socket.on("disconnect", () => {
    console.log("A user disconnected");

    const disconnectedUser = activeUsers.find(
      (user) => user.socketID === socket.id
    );
    io.emit("disconnectedUser", disconnectedUser);
    activeUsers = activeUsers.filter((user) => user.socketID !== socket.id);
  });

  // Chat messages
  socket.on("private message", (message) => {
    writeMessage(message);
    const friend = activeUsers.find((user) => user.id === message.to);
    if (friend) io.to(friend.socketID).emit("private message", message);
  });
});
