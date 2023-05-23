class CustomError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = 'failed'

        Error.captureStackTrace(this, this.constructor)
    }
}

export default CustomError