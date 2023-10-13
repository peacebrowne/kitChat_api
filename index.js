import http from "node:http";
import handler from "./handler.js";

const PORT = process.env.PORT || 8080;

const server = http
  .createServer(handler)
  .listen(PORT, () => console.log(`Server is running on port ${PORT}`));
