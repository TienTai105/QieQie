// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movieRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const contactRoutes = require('./routes/contactRoutes'); 
const authRoutes = require('./routes/authRoutes');
const { authenticate, authorizeAdmin } = require('./middleware/authMiddleware'); // <- THÊM DÒNG NÀY


// Bạn có thể import thêm 7 routes khác nếu có

const app = express();

// Middleware
app.use(cors()); // Cho phép truy cập từ React
app.use(express.json()); // Cho phép đọc JSON từ request

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Kết nối MongoDB Atlas thành công'))
.catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
