class apiError extends Error {
    constructor(statuscode, message = "Something went wrong",errors = [], stack = ""){
        super(message);
        this.statuscode = statuscode;
        this.message = message;
        this.errors = errors;
        this.stack = stack;
        this.success = false;
    }
}

export {apiError};