// models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    cinemas: { type: mongoose.Schema.Types.ObjectId, ref: "Cinema", required: true },
    room_number: { type: Number, required: true },
    seat_rows: { type: Number, required: true }, // số hàng
    seat_columns: { type: Number, required: true }, // số ghế mỗi hàng
    vipRows: { type: [String], default: [] }, // ví dụ: ["E","F"]
    coupleSeats: { type: [String], default: [] }, // ví dụ: ["F1","F3"]
    disabledSeats: { type: [String], default: [] }, // ví dụ: ["C5","C6"]
    seat_type: { type: String, default: "Standard" }, // chuẩn, imax, dolby...
    description: { type: String }
});

module.exports = mongoose.model("Room", roomSchema);