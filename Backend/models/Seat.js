// models/Seat.js
const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
    cinemaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema",
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    seatNumber: {
        type: String,
        required: true // ví dụ: "A1", "B12"
    },
    type: {
        type: String,
        enum: ["standard", "vip", "couple"],
        default: "standard"
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// đảm bảo trong 1 phòng không có duplicate seatNumber
SeatSchema.index({ roomId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Seat", SeatSchema, "seats");
