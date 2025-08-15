// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion'); // đúng đường dẫn

router.get('/', async (req, res) => {
  console.log('📥 Đã nhận GET /api/promotions');

  try {
    const promotions = await Promotion.find({});
    console.log('🎯 Số lượng promotions:', promotions.length);
    res.json(promotions);
  } catch (err) {
    console.error('❌ Lỗi khi truy vấn MongoDB:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
// GET /api/promotions/latest
router.get('/latest', async (req, res) => {
  try {
    const latestPromo = await Promotion.find({ active: true }).sort({ createdAt: -1 });
    if (!latestPromo) return res.status(404).json({ message: 'Không có khuyến mãi nào.' });

    res.json(latestPromo);
  } catch (err) {
    console.error('❌ Lỗi lấy latest promotion:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
