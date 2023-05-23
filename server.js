import dotenv from "dotenv"
dotenv.config()

import app from "./app.js"
import mongoose from "mongoose"

const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected Successfully to Database...')
    })
    .catch((err) => {
        console.log(err)
    })

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    console.log('Server shutting down...')
    server.close(() => {
        process.exit(1)
    })
})