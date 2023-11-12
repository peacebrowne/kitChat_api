const DEFAULT_HEADER = { "Content-type": "application/json" };

const headerResponse = (response, status, data) => {
  response.writeHead(
    status,
    data.session
      ? {
          "Set-Cookie": data.session,
          "Content-type": "application/json",
        }
      : DEFAULT_HEADER
  );

  response.write(JSON.stringify(data.status ? data.status : data));
  response.end();
};

export { DEFAULT_HEADER, headerResponse };
