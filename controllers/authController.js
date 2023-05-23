import User from "../models/User.js"
import asyncErrorHandler from "../Utils/asyncErrorHandler.js"
import jwt from "jsonwebtoken"
import CustomError from "../Utils/CustomError.js"
import util from "util"

const signToken = (id) => {
    const token = jwt.sign({ id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES })
    return token
}

export const protectRoutes = asyncErrorHandler(async (req, res, next) => {
    // 1. Get the token and check if exists
    const headerToken = req.headers.authorization
    let token;
    if (headerToken && headerToken.startsWith('Bearer')) {
        token = headerToken.split(' ')[1]
    }
    if (!token) {
        const err = new CustomError('You are not logged in!', 401)
        return next(err)
    }
    // 2. Check if token is valid
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR)
    // 3. Check if user exists
    const user = await User.findById(decodedToken.id)
    if (!user) {
        const err = new CustomError('This user does not exist!', 401)
        return next(err)
    }
    // 4. Check if password changed
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat)
    if (isPasswordChanged) {
        const err = new CustomError('Password has been changed recently. Please login again!', 401)
        return next(err)
    }
    // 5. Allow user to access
    req.userId = decodedToken.id
    next()
})

export const signup = asyncErrorHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    const token = signToken(user._id)
    res.status(201).json({
        status: 'success',
        token,
        user
    })
})

export const login = asyncErrorHandler(async (req, res, next) => {
    // 1. Check for email and password
    const { email, password } = req.body
    if (!email || !password) {
        const err = new CustomError('Please provide email and password for login!', 400)
        return next(err)
    }
    // 2. Check if user exists
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password, user.password))) {
        const err = new CustomError('Invaid email or password!',400)
        return next(err)
    }
    // 3. Login user
    const token = signToken(user._id)
    res.status(200).json({
        status: "success",
        token
    })
})