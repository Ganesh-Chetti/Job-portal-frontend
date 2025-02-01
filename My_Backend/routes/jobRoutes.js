// jobRoutes.js

const express = require('express');
const { authenticateToken, isCompany, authorizeRole, isUser } = require('../middlewares/authMiddleware');
const { createJob, getJobs, getJobById, deleteJob, getJobsByCategory, getJobsByCompany } = require('../controllers/jobController');

const router = express.Router();

router.post("/createJob",authenticateToken,isCompany,createJob)
router.get("/allJobs",authenticateToken,getJobs)
router.get("/getJob/:id",authenticateToken,getJobById)
router.delete('/job/:id',authenticateToken,isCompany,deleteJob)
router.get("/getJobsByCategory",authenticateToken,isUser,getJobsByCategory)
router.get("/getJobsByCompany",authenticateToken,isCompany,getJobsByCompany)


module.exports = router;
