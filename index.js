import { createServer } from "node:http";
import handler from "./handler.js";
import { Server } from "socket.io";
import { writeMessage } from "./repositories/repositories.js";

const PORT = process.env.PORT || 8080;
const users = [];

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

  socket.on("user", (data) => {
    const user = users.find((val) => val.user == data);
    if (!user) {
      users.push({
        user: data,
        id: socket.id,
      });
    }
  });

  socket.on("chat message", (msg) => {
    writeMessage(msg);
    const frd = users.find((val) => val.user == msg.to);
    io.to(frd.id).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");

    for (let i = 0; i < users.length; i++) {
      if (socket.id == users[i].id) {
        users.splice(i);
        break;
      }
    }
  });
});
