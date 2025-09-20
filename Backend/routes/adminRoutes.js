// adminRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const User = require('../models/User');
const { authMiddleware, authorizeAdmin } = require('../middleware/auth');

// 📌 API lấy thống kê tổng quan
router.get('/stats', authMiddleware, authorizeAdmin, async (req, res) => {
  try {
    const [movieCount, userCount, bookingCount, revenueAgg] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.aggregate([
        { $match: { status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ])
    ]);

    res.json({
      movies: movieCount,
      users: userCount,
      bookings: bookingCount,
      revenue: revenueAgg.length > 0 ? revenueAgg[0].total : 0
    });
  } catch (err) {
    console.error("❌ Lỗi lấy thống kê admin:", err);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê" });
  }
});

// 📌 API doanh thu theo tháng
router.get('/monthly-revenue', authMiddleware, authorizeAdmin, async (req, res) => {
  try {
    const result = await Booking.aggregate([
      { $match: { status: "confirmed", createdAt: { $exists: true } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formatted = result.map(item => ({
      month: `${item._id.month.toString().padStart(2, "0")}/${item._id.year}`,
      revenue: item.revenue
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi tính doanh thu theo tháng:", err);
    res.status(500).json({ message: "Lỗi server khi lấy doanh thu theo tháng" });
  }
});

module.exports = router;
