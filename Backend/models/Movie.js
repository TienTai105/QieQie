const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  genres: [String],
  duration: Number,
  poster: String,
  trailerUrl: String,
  description: String,
  actors: String,
  comingSoon: Boolean,
  showing: Boolean,
  director: String,
  releaseDate: String,
  ageRestriction: {
    code: String,
    description: String
  },
  language: String
});

module.exports = mongoose.model('Movie', movieSchema);

