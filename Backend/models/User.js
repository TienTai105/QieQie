const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  idNumber: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agreeTerms: { type: Boolean, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);
