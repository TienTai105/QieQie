<<<<<<< HEAD
// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion'); // đúng đường dẫn

router.get('/', async (req, res) => {
  console.log('📥 Đã nhận GET /api/promotions');

  try {
    const promotions = await Promotion.find({});
    console.log('🎯 Số lượng promotions:', promotions.length);
=======
// routes/promotionRoutes.js
const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');

// =======================
// GET all promotions
// =======================
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find();
>>>>>>> b32aa75 (update code)
    res.json(promotions);
  } catch (err) {
    console.error('❌ Lỗi khi truy vấn MongoDB:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
<<<<<<< HEAD
// GET /api/promotions/latest
router.get('/latest', async (req, res) => {
  try {
    const latestPromo = await Promotion.find({ active: true }).sort({ createdAt: -1 });
    if (!latestPromo) return res.status(404).json({ message: 'Không có khuyến mãi nào.' });

    res.json(latestPromo);
=======

// =======================
// GET latest active promotion
// =======================
router.get('/latest', async (req, res) => {
  try {
    const latestPromo = await Promotion.find({ active: true }).sort({ createdAt: -1 }).limit(1);
    if (!latestPromo || latestPromo.length === 0) {
      return res.status(404).json({ message: 'Không có khuyến mãi nào.' });
    }
    res.json(latestPromo[0]);
>>>>>>> b32aa75 (update code)
  } catch (err) {
    console.error('❌ Lỗi lấy latest promotion:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

<<<<<<< HEAD
=======
// =======================
// GET promotion by ID
// =======================
router.get('/:id', async (req, res) => {
  try {
    const promo = await Promotion.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promo);
  } catch (err) {
    console.error('❌ Lỗi GET promotion by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =======================
// CREATE promotion
// =======================
router.post('/', async (req, res) => {
  try {
    const { title, shortDescription, conditions, notes, image, active } = req.body;
    const promo = new Promotion({
      title,
      shortDescription,
      conditions: conditions || [],
      notes: notes || [],
      image,
      active: active !== undefined ? active : true,
      createdAt: new Date()
    });
    const newPromo = await promo.save();
    res.status(201).json(newPromo);
  } catch (err) {
    console.error('❌ Lỗi tạo promotion:', err);
    res.status(400).json({ error: err.message });
  }
});

// =======================
// UPDATE promotion
// =======================
router.put('/:id', async (req, res) => {
  try {
    const updatedPromo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPromo) return res.status(404).json({ message: 'Promotion not found' });
    res.json(updatedPromo);
  } catch (err) {
    console.error('❌ Lỗi update promotion:', err);
    res.status(400).json({ error: err.message });
  }
});

// =======================
// DELETE promotion
// =======================
router.delete('/:id', async (req, res) => {
  try {
    const deletedPromo = await Promotion.findByIdAndDelete(req.params.id);
    if (!deletedPromo) return res.status(404).json({ message: 'Promotion not found' });
    res.json({ message: 'Promotion deleted successfully' });
  } catch (err) {
    console.error('❌ Lỗi delete promotion:', err);
    res.status(500).json({ error: err.message });
  }
});
>>>>>>> b32aa75 (update code)

module.exports = router;
