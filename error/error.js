import { DEFAULT_HEADER } from "../util/util.js";
class Err {

    constructor(request,response) {

        this.request = request;
        this.response = response;
        
    }

    handlerError(response){

        return error => {

            console.log('something bad has happened!!', error.message)
            response.writeHead(500, DEFAULT_HEADER);
            
            this.response.write(JSON.stringify({
                error: 'Internal server error!!'
            }))
    
            return this.response.end();
        }

    }

}

export default Err