import CustomError from "../Utils/CustomError.js"

const devError = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        stackTrace: err.stack,
        message: err.message,
        error: err
    })
}

const prodError = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}

const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}`
    return new CustomError(msg, 400)
}

const duplicateKeyHandler = (err) => {
    const msg = `There is already a user with this email. Please use another email!`
    return new CustomError(msg, 400)
}

const validationErrorHandler = (err) => {
    const allErrors = Object.values(err.errors).map(item => item.message).join('. ')
    const msg = `Invalid input data: ${allErrors}`
    return new CustomError(msg, 400)
}

const tokenExpiredHandler = (err) => {
    const msg = 'Token expired. Please login again!'
    return new CustomError(msg, 400)
}

const jwtError = (err) => {
    const msg = 'Invalid Token. Please try to login.'
    return new CustomError(msg, 400)
}

const globalErrorHandler = (error, req, res, next) => {
    error.status = error.status || 'error'
    error.statusCode = error.statusCode || 500

    if (process.env.NODE_ENV === 'development') {
        return devError(res, error)
    }

    // Invalid id value
    if (error.name === 'CastError') {
        error = castErrorHandler(error)
    }
    // Duplicate Key Error
    if (error.code === 11000) {
        error = duplicateKeyHandler(error)
    }
    // Mongoose validation error
    if (error.name === 'ValidationError') {
        error = validationErrorHandler(error)
    }
    // Expired Token
    if (error.name === 'TokenExpiredError') {
        error = tokenExpiredHandler(error)
    }
    // jsonwebtoken Error
    if (error.name === 'JsonWebTokenError') {
        error = jwtError(error)
    }

    prodError(res, error)
}

export default globalErrorHandler