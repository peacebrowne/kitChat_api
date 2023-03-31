import http from 'node:http';
import handler from './handler.js';

const PORT = process.env.PORT|| 5000;

const server = http.createServer(handler).listen(PORT, () => console.log(`Server is listening on port ${PORT}`))

export {
    server
}
