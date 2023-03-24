import routes from './routes/routes.js';
import { parse } from 'node:url';
import Err from "./error/error.js"
const err = new Err()

const handler = (request,response) => {

    const {
        url,
        method
    } = request

    const {
        pathname
    } = parse(url,true)

    const key = `${pathname}:${method.toLowerCase()}`
    const chosen = routes[key] || routes.default

    return Promise.resolve(chosen(request,response))
    .catch(err.handlerError(response))

}

export default handler