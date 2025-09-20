// backend/models/Combo.js
const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },        // Tên combo
        description: { type: String },                 // Mô tả combo
        image: { type: String },                       // URL ảnh (png/jpg…)
        price: { type: Number, required: true },       // Giá tiền
        type: { type: String, enum: ["combo", "single"], default: "combo" }, // combo hoặc sản phẩm lẻ
    },
    { timestamps: true }
);

module.exports = mongoose.model('Combo', comboSchema);
