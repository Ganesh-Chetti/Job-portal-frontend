// // adminRoutes.js

const express = require('express');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();
// Admin Authentication
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

// Admin Dashboard
// Route to get admin profile
router.get('/profile', authenticateToken, adminController.getAdminProfile);
// Route to get all jobs data
router.get('/jobs',authenticateToken, adminController.getAllJobs);

// User Management
router.get('/users', authenticateToken, authorizeAdmin, adminController.getAllUsers);
// router.put('/users/:userId', authenticateToken, authorizeAdmin, adminController.updateUser);
router.delete('/users/:userId', authenticateToken, authorizeAdmin, adminController.deleteUser);

// Company Management
router.get('/companies', authenticateToken, authorizeAdmin, adminController.getAllCompanies);
// router.put('/companies/:companyId', authenticateToken, authorizeAdmin, adminController.updateCompany);
router.delete('/companies/:companyId', authenticateToken, authorizeAdmin, adminController.deleteCompany);

module.exports = router;
