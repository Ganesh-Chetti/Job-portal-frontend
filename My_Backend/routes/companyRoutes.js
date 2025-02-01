const express = require('express');
const router = express.Router();
const { registerCompany, loginCompany, getProfile, updateProfile } = require('../controllers/companyController');
const { authenticateToken, isCompany } = require('../middlewares/authMiddleware');

router.post('/register', registerCompany);
router.post('/login', loginCompany);
router.get('/profile', authenticateToken,isCompany, getProfile);
router.put('/profile', authenticateToken,isCompany, updateProfile);

module.exports = router;
