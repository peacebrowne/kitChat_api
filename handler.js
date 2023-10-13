import { parse } from "node:url";
import { routes } from "./routes/routes.js";
import { headerResponse } from "./util/util.js";

const handler = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Request-Method", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  response.setHeader("Access-Control-Allow-Headers", "*");

  if (request.method === "OPTIONS") {
    response.writeHead(200);
    response.end();
    return;
  }

  const { url, method } = request;
  const { pathname } = parse(url, true);

  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = routes[key] || routes.default;

  return Promise.resolve(chosen(request, response)).catch((error) => {
    headerResponse(
      response,
      500,
      {
        error: `Internal server error!! ${error}`,
      },
      "json"
    );
  });
};

export default handler;
