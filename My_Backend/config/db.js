const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ganeshpatelchetti:Ganesh@cluster0.krepa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/");
    // await mongoose.connect("mongodb://localhost:27017/");
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;