const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const {
    name,
    birthDate,
    phone,
    username,
    idNumber,
    email,
    password,
    confirmPassword,
    agreeTerms
  } = req.body;

  try {
    // Kiểm tra mật khẩu
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu không khớp" });
    }

    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email hoặc tên đăng nhập đã tồn tại" });
    }

    // Tạo user mới (chưa mã hóa mật khẩu, vì bạn yêu cầu không mã hóa)
    const newUser = new User({
      name,
      birthDate,
      phone,
      username,
      idNumber,
      email,
      password,
      agreeTerms,
      role: "user"
    });

    await newUser.save();

    return res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi đăng ký:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  let { emailOrPhone, password } = req.body;
  emailOrPhone = emailOrPhone?.trim(); // loại bỏ khoảng trắng

  console.log("📩 Nhận:", emailOrPhone, password);

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });
    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role , username: user.username},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token, role: user.role });
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
});



module.exports = router;
