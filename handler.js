import { parse } from "node:url";
import { routes } from "./routes/routes.js";
import { headerResponse } from "./util/util.js";

const handler = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Request-Method", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  response.setHeader("Access-Control-Allow-Headers", "*");

  if (request.method === "OPTIONS") {
    response.writeHead(200);
    response.end();
    return;
  }

  const { url, method } = request;

  // Extract parameters from the URL if needed
  const { pathname, search } = parse(url, true);
  const param = new URLSearchParams(search);

  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = routes[key] || routes.default;

  return Promise.resolve(
    param ? chosen(request, response, param) : chosen(request, response)
  ).catch((error) => {
    headerResponse(response, 500, {
      error: `Internal server error!! ${error}`,
    });
  });
};

export default handler;
