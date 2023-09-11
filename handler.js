import { parse } from "node:url";
import { routes } from "./routes/routes.js";
import { DEFAULT_HEADER } from "./util/util.js";

function handler(request, response) {
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
}

export default handler;
