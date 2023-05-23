import express from "express"
import authRouter from "./routes/authRoutes.js"
import jobRouter from "./routes/jobsRoutes.js"
import globalErrorHandler from "./controllers/errorController.js"
import CustomError from './Utils/CustomError.js'

const app = express()

app.use(express.json())

app.use('/api/v1/users', authRouter)

app.use('/api/v1/jobs', jobRouter)

app.use('*', (req, res, next) => {
    const err = new CustomError(`Couldn't find ${req.originalUrl} on server!`, 404)
    next(err)
})

app.use(globalErrorHandler)

export default app