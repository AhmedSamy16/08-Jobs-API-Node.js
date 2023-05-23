import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxLength: 50,
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Please provide position!'],
        maxLength: 100,
        trim: true
    },
    status: {
        type: String,
        enum: ['interview', 'pending', 'declined'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Job = mongoose.model('Job', jobSchema)

export default Job