import { parse } from "node:url";
import { routes } from "./routes/routes.js";
import { DEFAULT_HEADER } from "./util/util.js";

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
    response.writeHead(500, DEFAULT_HEADER);
    response.write(
      JSON.stringify({ error: `Internal server error!! ${error}` })
    );
    response.end();
  });
};

export default handler;
