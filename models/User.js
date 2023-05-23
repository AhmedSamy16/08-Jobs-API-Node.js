import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'username is required!'],
        trim: true,
        minLength: [3, 'username should be 8 or more charachters'],
        maxLength: [50, 'username should be 50 or less charachters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        trim: true,
        unique: true,
        lowercase: true,
        maxLength: [50, 'email should be 50 or less charachters'],
        validate: [validator.isEmail, 'Email is not valid. Please Enter a valid Email']
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [8, 'Password should be 8 or more charachters'],
        maxLength: [50, 'Password should be 50 or less charachters'],
        trim: true,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(val) {
                return val === this.password
            },
            message: 'Password and confirm password are not the same'
        }
    },
    passwordChangedAt: Date
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    // Encrypt Password
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    next()
})

userSchema.methods.comparePassword = async function(pswd, pswdDB) {
    return await bcrypt.compare(pswd, pswdDB)
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const pswdTimestamp = this.passwordChangedAt.getTime() / 1000
        return pswdTimestamp < JWTTimestamp
    }
    return false
}

const User = mongoose.model('User', userSchema)

export default User