// server.js
const express = require('express');
<<<<<<< HEAD
=======
const path = require('path'); // ✅ Thêm module 'path'
>>>>>>> b32aa75 (update code)
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

<<<<<<< HEAD
const movieRoutes = require('./routes/movieRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const contactRoutes = require('./routes/contactRoutes'); 
const authRoutes = require('./routes/authRoutes');
const { authenticate, authorizeAdmin } = require('./middleware/authMiddleware'); // <- THÊM DÒNG NÀY


// Bạn có thể import thêm 7 routes khác nếu có
=======
// Import routes
const movieRoutes = require('./routes/movieRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const contactRoutes = require('./routes/contactRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const seatRoutes = require('./routes/seatRoutes');
require('./models/Cinema');
const comboRoutes = require("./routes/comboRoutes");
const roomRoutes = require("./routes/roomRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // ✅ Import route thanh toán
const authRoutes = require("./routes/authRoutes"); // ✅ Import route xác thực
const userRoutes = require("./routes/userRoutes"); // ✅ Import route người dùng
const adminRoutes = require("./routes/adminRoutes");
const { authMiddleware, authorizeAdmin } = require('./middleware/auth');


>>>>>>> b32aa75 (update code)

const app = express();

// Middleware
<<<<<<< HEAD
app.use(cors()); // Cho phép truy cập từ React
app.use(express.json()); // Cho phép đọc JSON từ request

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
=======
app.use(cors());
app.use(express.json());

// ✅ Phục vụ các file tĩnh từ thư mục 'public'
app.use("/images", express.static(path.join(__dirname, "public/images")));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
>>>>>>> b32aa75 (update code)
})
.then(() => console.log('✅ Kết nối MongoDB Atlas thành công'))
.catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

<<<<<<< HEAD
// Khai báo route API
app.use('/api/movies', movieRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/promotions/latest', promotionRoutes);
app.use('/api/contacts', contactRoutes); 
app.use('/api/auth', authRoutes); // Đăng nhập

app.get('/api/admin/dashboard', authenticate, authorizeAdmin, (req, res) => {
  res.json({ message: 'Trang dành riêng cho Admin', user: req.user });
});

// Khởi động server
=======
// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/showtime', showtimeRoutes);
app.use('/api/seats', seatRoutes);
app.use("/api/combos", comboRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payments", paymentRoutes); // ✅ Sử dụng route thanh toán
app.use("/api/auth", authRoutes); // ✅ Sử dụng route xác thực
app.use("/api/users", userRoutes); // ✅ Sử dụng route người dùng
app.use("/api/admin", adminRoutes); // ✅ Sử dụng route admin
app.get('/api/admin/dashboard', authMiddleware, authorizeAdmin, (req, res) => {
  res.json({ message: 'Trang dành riêng cho Admin', user: req.user });
});
// Start server
>>>>>>> b32aa75 (update code)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
