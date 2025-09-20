// routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// ✅ Lấy danh sách tất cả phòng
router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find().populate("cinemas");
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server", detail: err.message });
    }
});

// ✅ Lấy 1 phòng theo ID
router.get("/:id", async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate("cinemas");
        if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server", detail: err.message });
    }
});

// ✅ Tạo mới 1 phòng
router.post("/", async (req, res) => {
    try {
        const newRoom = new Room(req.body);
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ error: "Dữ liệu không hợp lệ", detail: err.message });
    }
});

// ✅ Cập nhật phòng
router.put("/:id", async (req, res) => {
    try {
        const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Không tìm thấy phòng" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "Lỗi update", detail: err.message });
    }
});

// ✅ Xoá phòng
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Room.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy phòng" });
        res.json({ message: "Đã xoá thành công" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi server", detail: err.message });
    }
});

module.exports = router;
