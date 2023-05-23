import express from "express"
import { protectRoutes } from "../controllers/authController.js"
import { getAllJobs, createJob, getJobById, updateJob, deleteJob } from "../controllers/jobsController.js"

const router = express.Router()

router.route('/')
    .get(protectRoutes, getAllJobs)
    .post(protectRoutes, createJob)

router.route('/:id')
    .get(protectRoutes, getJobById)
    .patch(protectRoutes, updateJob)
    .delete(protectRoutes, deleteJob)

export default router