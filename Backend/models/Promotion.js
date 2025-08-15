const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: String,
  shortDescription: String,
  conditions: [String],
  notes: [String],
  image: String,
  active: Boolean,
  createdAt: Date,
});

module.exports = mongoose.model('Promotion', promotionSchema);
