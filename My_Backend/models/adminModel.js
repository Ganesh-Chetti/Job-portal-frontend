const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' }, // Role is fixed as 'admin'
}, { timestamps: true });
adminSchema.set("versionKey", false);
// Pre-save hook to hash password before saving
adminSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Static method to compare passwords
adminSchema.statics.comparePassword = async function (inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = mongoose.model('Admin', adminSchema);
