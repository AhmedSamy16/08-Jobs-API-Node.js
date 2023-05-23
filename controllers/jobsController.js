import Job from "../models/Job.js"
import asyncErrorHandler from "../Utils/asyncErrorHandler.js"
import ApiFeatures from "../Utils/ApiFeatures.js"
import CustomError from '../Utils/CustomError.js'

export const getAllJobs = asyncErrorHandler(async (req, res, next) => {
    let query = new ApiFeatures(Job.find({ createdBy: req.userId }), req.query).filter().sort().limitFields().paginate()
    let jobs = await query.query
    res.status(200).json({
        status: "success",
        count: jobs.length,
        data: { jobs }
    })
})

export const createJob = asyncErrorHandler(async (req, res, next) => {
    req.body.createdBy = req.userId
    const job = await Job.create(req.body)
    res.status(201).json({
        status: 'success',
        data: { job }
    })
})

export const getJobById = asyncErrorHandler(async (req, res, next) => {
    const jobId = req.params.id
    const job = await Job.findOne({ _id: jobId, createdBy: req.userId })
    if (!job) {
        const err = new CustomError('Job not found', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { job }
    })
})

export const updateJob = asyncErrorHandler(async (req, res, next) => {
    const jobId = req.params.id
    const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: req.userId }, req.body, { new: true, runValidators: true })
    if (!job) {
        const err = new CustomError('Job not found', 404)
        return next(err)
    }
    res.status(200).json({
        status: 'success',
        data: { job }
    })
})

export const deleteJob = asyncErrorHandler(async (req, res, next) => {
    const jobId = req.params.id
    const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: req.userId })
    if (!job) {
        const err = new CustomError('Job not found', 404)
        return next(err)
    }
    res.status(204).json({
        status: "success"
    })
})