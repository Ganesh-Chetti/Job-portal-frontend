// userController.js
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

exports.registerUser = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const { fullname, email, mobilenumber,skills, password } = req.body;

    // Validate email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please use a valid email address" });
    }

    // Validate mobile number
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobilenumber)) {
      return res
        .status(400)
        .json({ error: "Mobile number must contain exactly 10 digits" });
    }

    // Ensure `skills` is an array
    // let formattedSkills;
    // try {
    //   formattedSkills = Array.isArray(skills)
    //     ? skills.map((item) => item.trim())
    //     : skills.split(",").map((item) => item.trim());
    // } catch (error) {
    //   return res.status(400).json({ error: "Invalid format for skills" });
    // }

    // if (!formattedSkills || formattedSkills.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ error: "Skills must be a non-empty array or valid string" });
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      fullname,
      email,
      mobilenumber,
      skills,
      password: hashedPassword,
      resume: req.file.path,
    });

    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        skills: user.skills,
      },
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: err.message || "Something went wrong!" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("Invalid credentials");

    // Validate the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(401).send("Invalid credentials");

    // Generate JWT token
    const secretKey = process.env.JWT_SECRET || "default_secret_key";
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).send({
      message: "Login successful",
      user: { id: user._id, fullname: user.fullname, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send({ error: err.message || "Something went wrong!" });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    console.log("Fetching profile for user ID:", req.user.id);

    // Fetch the user by ID
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.error("User not found for ID:", req.user.id);
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).send({ error: err.message || "Something went wrong!" });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT
    const { fullname, email, mobilenumber, skills, password } = req.body;

    // Validate email
    if (email) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).send("Please use a valid email address");
      }
    }

    // Validate mobile number
    if (mobilenumber) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobilenumber)) {
        return res
          .status(400)
          .send("Mobile number must contain exactly 10 digits");
      }
    }

    // Hash the password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        email,
        mobilenumber,
        skills,
        password: hashedPassword || undefined, // Only update if provided
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(updatedUser);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send({ error: err.message || "Something went wrong!" });
  }
};
