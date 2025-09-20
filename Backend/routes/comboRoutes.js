// backend/routes/combos.js
const express = require("express");
const router = express.Router();
const Combo = require("../models/Combo");

// Lấy tất cả combos
router.get("/", async (req, res) => {
    try {
        const combos = await Combo.find();
        res.json(combos);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi lấy combos" });
    }
});

module.exports = router;
