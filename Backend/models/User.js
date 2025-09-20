const mongoose = require('mongoose');
<<<<<<< HEAD
=======
const bcrypt = require('bcryptjs');
>>>>>>> b32aa75 (update code)

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  idNumber: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agreeTerms: { type: Boolean, required: true },
<<<<<<< HEAD
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

=======
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  membership: {
    level: { type: String, default: 'Standard' },
    points: { type: Number, default: 0 }
  }
});

// ✅ Tự động mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Thêm phương thức để so sánh mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

>>>>>>> b32aa75 (update code)
module.exports = mongoose.model('User', userSchema);
