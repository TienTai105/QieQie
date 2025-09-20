const mongoose = require("mongoose");

const SeatHoldSchema = new mongoose.Schema({
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime", required: true, index: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seats: [{ type: String, required: true }],
  userId: { type: String, required: true }, // Dùng session ID của client để định danh
  expireAt: { type: Date, required: true },
});

// TTL index: MongoDB sẽ tự động xóa các document khi trường expireAt đã qua
SeatHoldSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
SeatHoldSchema.index({ showtimeId: 1, date: 1, time: 1, seats: 1 });

module.exports = mongoose.model("SeatHold", SeatHoldSchema);