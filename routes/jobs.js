const express = require('express')
const router = express.Router()
// const { getAllJobs } = require('../controllers/jobs')
const { getAllJobs, createJob, deleteJob, getJob, updateJob } = require('../controllers/jobs')

router.route('/').get(getAllJobs)
router.route('/').post(createJob)
router.route('/:id').delete(deleteJob)
router.route('/:id').get(getJob)
router.route('/:id').put(updateJob)

module.exports = router
