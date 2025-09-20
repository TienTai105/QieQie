<<<<<<< HEAD
// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); // đúng đường dẫn

// Route GET tất cả phim
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
=======
const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const { authMiddleware, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

// ✅ GET all movies (hỗ trợ sort, limit)
router.get("/", async (req, res) => {
  try {
    const { limit = 100, sort = "-releaseDate" } = req.query;
    const movies = await Movie.find().sort(sort).limit(Number(limit));
    res.json({ items: movies }); // 🔑 trả về object có "items" để frontend map đúng
>>>>>>> b32aa75 (update code)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// POST /api/movies - Thêm phim mới
router.post('/', async (req, res) => {
=======
// ✅ GET movie by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID phim không hợp lệ" });
    }
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Không tìm thấy phim" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST add movie (Admin only)
router.post("/", authMiddleware, authorizeAdmin, async (req, res) => {
>>>>>>> b32aa75 (update code)
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// PUT /api/movies/:id - Cập nhật phim
router.put('/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
=======
// ✅ PUT update movie (Admin only)
router.put("/:id", authMiddleware, authorizeAdmin, async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMovie) return res.status(404).json({ message: "Không tìm thấy phim để cập nhật" });
>>>>>>> b32aa75 (update code)
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// DELETE /api/movies/:id - Xoá phim
router.delete('/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Phim đã được xoá' });
=======
// ✅ DELETE movie (Admin only)
router.delete("/:id", authMiddleware, authorizeAdmin, async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy phim để xoá" });
    res.json({ message: "Phim đã được xoá thành công" });
>>>>>>> b32aa75 (update code)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
<<<<<<< HEAD
module.exports = router;


=======

module.exports = router;
>>>>>>> b32aa75 (update code)
