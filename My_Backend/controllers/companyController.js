const Company = require('../models/companyModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Company Registration
exports.registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyEstablishedDate,
      companyRegistrationNumber,
      companyWebsiteLink,
      password,
      aboutCompany,
      location,
    } = req.body;

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(companyEmail)) {
      return res.status(400).send({ error: 'Invalid email format' });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ companyEmail });
    if (existingCompany) {
      return res.status(400).send({ error: 'Company with this email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the company
    const company = new Company({
      companyName,
      companyEmail,
      companyEstablishedDate,
      companyRegistrationNumber,
      companyWebsiteLink,
      password: hashedPassword,
      aboutCompany,
      location,
    });

    await company.save();
    res.status(201).send({ message: 'Company registered successfully', company });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

// Company Login
exports.loginCompany = async (req, res) => {
  try {
    const { companyEmail, password } = req.body;

    // Find the company
    const company = await Company.findOne({ companyEmail });
    if (!company) return res.status(401).send({ error: 'Invalid credentials' });

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    console.log("ROLL",company.role)
    console.log("hiiiiii")
    const token = jwt.sign({ id: company._id, role: company.role }, secretKey, { expiresIn: '1h' });

    res.status(200).send({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

// Get Company Profile
exports.getProfile = async (req, res) => {
  try {
    const companyId = req.user.id; // Extract company ID from the JWT token
    const company = await Company.findById(companyId).select('-password'); // Exclude the password

    if (!company) {
      return res.status(404).send({ error: 'Company not found' });
    }

    res.status(200).send(company);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

// Update Company Profile
exports.updateProfile = async (req, res) => {
  try {
    const companyId = req.user.id; // Extract company ID from the JWT token
    const {
      companyName,
      companyEmail,
      companyEstablishedDate,
      companyRegistrationNumber,
      companyWebsiteLink,
    } = req.body;

    // Validate email format
    if (companyEmail) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(companyEmail)) {
        return res.status(400).send({ error: 'Invalid email format' });
      }
    }

    // Update the company
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        companyName,
        companyEmail,
        companyEstablishedDate,
        companyRegistrationNumber,
        companyWebsiteLink,
      },
      { new: true, runValidators: true } // Ensure validation is applied during update
    ).select('-password');

    if (!updatedCompany) {
      return res.status(404).send({ error: 'Company not found' });
    }

    res.status(200).send(updatedCompany);
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).send({ error: err.message || 'Something went wrong!' });
  }
};

