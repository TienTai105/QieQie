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

// POST /api/movies - Thêm phim mới
router.post('/', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/movies/:id - Cập nhật phim
router.put('/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/movies/:id - Xoá phim
router.delete('/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Phim đã được xoá' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;


