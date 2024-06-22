class ApiError extends Error {
    constructor (
        statusCode , 
        message = "Something wnet wrong" ,
        errors = [] , 
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.statusCode= false
        this.errors = errors


        if (stack) {
            this.stack = stack
        } else{

        }

    }
}

export {ApiError}