const DEFAULT_HEADER = { "Content-type": "application/json" };
const HEADERS = {
  json: { "Content-type": "application/json" },
  plain: { "Content-type": "plain/text" },
};

const headerResponse = (response, status, data) => {
  response.writeHead(status, DEFAULT_HEADER);
  response.write(JSON.stringify(data));
  response.end();
};

export { DEFAULT_HEADER, headerResponse };
