import { createServer } from "node:http";
import handler from "./handler.js";
import { Server } from "socket.io";
import { writeMessage } from "./repositories/repositories.js";

const PORT = process.env.PORT || 8080;
let users = [];

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
    const existingUser = users.find((user) => user.user === data);
    if (!existingUser) {
      users.push({ user: data, id: socket.id });
      if (users.length > 1) io.emit("active", users);
    }
  });

  // Disconnected users
  socket.on("disconnect", () => {
    console.log("A user disconnected");

    const disconnectedUser = users.find((user) => user.id === socket.id);
    io.emit("disconnectedUser", disconnectedUser);
    users = users.filter((user) => user.id !== socket.id);
  });

  // Chat messages
  socket.on("chat message", (msg) => {
    console.log("Current message");

    writeMessage(msg);
    const friend = users.find((user) => user.user === msg.to);
    if (friend) io.to(friend.id).emit("chat message", msg);
  });
});
