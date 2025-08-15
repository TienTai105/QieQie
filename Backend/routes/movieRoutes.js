// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); // đúng đường dẫn

// Route GET tất cả phim
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


