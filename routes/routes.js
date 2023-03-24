import { DEFAULT_HEADER,header } from "../util/util.js";
import repositories from "../repositories/repositories.js"

const routes = {

    '/user:get': async (request,response) => {
        response.writeHead(200,header)
        response.write('GET METHOD')
        response.end()
    },
    '/user:post': async(request,response) => {
        response.writeHead(200,header)
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