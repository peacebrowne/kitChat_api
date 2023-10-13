import { readData, writeData } from "../repositories/repositories.js";
import { headerResponse } from "../util/util.js";
import { once } from "node:events";
import { signIn, signUp } from "../validation/validation.js";

const routes = {
  "/user:get": async (request, response) => {
    const data = await readData();
    headerResponse(response, 200, data);
  },
  "/user:post": async (request, response) => {
    const data = await once(request, "data");
    const result = await signUp(data);
    headerResponse(response, 200, result);
  },
  "/signIn:post": async (request, response) => {
    const data = await once(request, "data");
    const result = await signIn(data);
    headerResponse(response, 200, result);
  },
  default: (request, response) =>
    headerResponse(response, 404, "Ooops not found!"),
};

export { routes };
