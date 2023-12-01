import { readData, singleUser } from "../repositories/repositories.js";
import { headerResponse } from "../util/util.js";
import { once } from "node:events";
import {
  signIn,
  signUp,
  logOut,
  privateMessages,
} from "../validation/validation.js";
const routes = {
  "/user:get": async (request, response, param) => {
    const id = param.get("id");
    const data = id ? await singleUser(id) : await readData();
    headerResponse(response, 200, data);
  },
  "/messages:get": async (request, response, param) => {
    const from = param.get("from");
    const to = param.get("to");
    const data = await privateMessages(from, to);
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
    headerResponse(response, result ? 200 : 401, result);
  },
  default: (request, response) =>
    headerResponse(response, 404, "Ooops not found!"),
};

export { routes };
