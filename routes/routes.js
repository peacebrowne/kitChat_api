import { DEFAULT_HEADER } from "../util/util.js";
import { readFile, writeFile } from "../repositories/repositories.js";
import { once } from "node:events";

const routes = {
  "/user:get": async (request, response) => {
    const data = await readFile();
    response.writeHead(200, DEFAULT_HEADER);
    response.write(JSON.stringify(data));
    response.end();
  },
  "/user:post": async (request, response) => {
    const data = once(request, "data");
    console.log("post");
    const result = await writeFile(data);
    response.writeHead(200, DEFAULT_HEADER);
    response.write(JSON.stringify(result));
    response.end();
  },
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    response.write("Ooops not found!");
    response.end();
  },
};

export { routes };
