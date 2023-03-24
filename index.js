import http from 'node:http';
import handler from './handler.js';
import cors from "cors";

const PORT = process.env.PORT|| 5000;

const server = http.createServer(handler).listen(PORT, {
    cors: {
        origin: ['http//localhost:5000']
    }
}, () => console.log(`Server is listening on port ${PORT}`))


export {
    server
}
