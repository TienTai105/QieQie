// JavaScript
// routes/movies.js
import express from 'express';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';

const router = express.Router();

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid movie id' });
        }
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        return res.json(movie);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router;