// User.js (Model)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobilenumber: { type: String, required: true },
  skills: {
    type: String
  },
  resume: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

userSchema.set("versionKey", false);

module.exports = mongoose.model('User', userSchema);