// adminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const Job = require("../models/jobModel")

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).send('Invalid email format');
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send('Admin with this email already exists');
    }

    // Create a new admin
    const admin = new Admin({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in the model
    });

    await admin.save();
    res.status(201).send({
      message: 'Admin registered successfully',
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Error during admin registration:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

// Adminlogin

 exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).send('Invalid credentials');

    // Validate password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) return res.status(401).send('Invalid credentials');

    // Generate JWT token
    const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      secretKey,
      { expiresIn: '1h' }
    );

    res.status(200).send({
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id; // Extract admin ID from JWT token
    const admin = await Admin.findById(adminId).select('-password'); // Exclude password from response

    if (!admin) {
      return res.status(404).send({ error: 'Admin not found' });
    }

    res.status(200).send(admin);
  } catch (err) {
    console.error('Error fetching admin profile:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

// Get All Jobs Data
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
  .populate({
    path: "company",
    select: "-password -companyRegistrationNumber -companyEmail -companyEstablishedDate -companyWebsiteLink -aboutCompany -role", // Exclude the password field
  })
  .select("-password");
  
    

    if (!jobs.length) {
      return res.status(404).send({ message: 'No jobs found' });
    }

    res.status(200).send(jobs);
  } catch (err) {
    console.error('Error fetching jobs data:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};


// CRUD Operations on Users and Companies

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).send(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).send('User not found');
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

// Get All Companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select('-password');
    res.status(200).send(companies);
  } catch (err) {
    console.error('Error fetching companies:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};


// Delete Company
exports.deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) return res.status(404).send('Company not found');
    res.status(200).send({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Error deleting company:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};
