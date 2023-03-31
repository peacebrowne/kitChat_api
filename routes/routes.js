import { DEFAULT_HEADER } from "../util/util.js";
import {
    readFile,
    writeFile
} from "../repositories/repositories.js"
import { once } from "node:events";

const routes = {

    '/user:get': async (request,response) => {

        readFile()
        response.writeHead(200,DEFAULT_HEADER)
        response.write('GET METHOD')
        response.end()

    },
    '/user:post': async(request,response) => {

        const data = await once(request, 'data') 
        const items = JSON.parse(data)
        writeFile(items)

        response.writeHead(200,DEFAULT_HEADER)
        response.write('POST METHOD')
        response.end()

    },
    default: (request,response) => {

        response.writeHead(404,DEFAULT_HEADER)
        response.write('Whoops! Page not found!')
        response.end()
        
    }

}

export default routes