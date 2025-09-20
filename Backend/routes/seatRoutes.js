const express = require("express");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const router = express.Router();
const Booking = require("../models/Booking");
const Room = require("../models/Room"); // ✅ Dùng Room để tạo layout

// ✅ Hàm helper để tạo sơ đồ ghế từ cấu hình phòng
const generateSeatsFromRoom = (room) => {
    const seats = [];
    const rows = Array.from({ length: room.seat_rows }, (_, i) => String.fromCharCode(65 + i)); // A, B, C...

    for (const row of rows) {
        for (let col = 1; col <= room.seat_columns; col++) {
            const seatNumber = `${row}${col}`;

            let type = "standard";
            if (room.vipRows?.includes(row)) {
                type = "vip";
            }
            if (room.coupleSeats?.includes(seatNumber)) {
                type = "couple";
            }

            // Ghế bị vô hiệu hóa (lối đi, hỏng...) sẽ không được thêm vào sơ đồ
            if (!room.disabledSeats?.includes(seatNumber)) {
                seats.push({
                    seatNumber,
                    type,
                    available: true, // Mặc định là có sẵn
                    isBooked: false, // Sẽ được cập nhật sau
                });
            }
        }
    }
    return seats;
};

// GET /api/seats?showtimeId=...&date=...&time=...&roomId=...
router.get("/", async (req, res) => {
    try {
        const { showtimeId, date, time, roomId } = req.query;

        if (!showtimeId || !date || !time || !roomId) {
            return res.status(400).json({ message: "Thiếu thông tin showtimeId, date, time, hoặc roomId" });
        }

        // 1. Lấy thông tin phòng chiếu từ DB
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Không tìm thấy phòng chiếu" });
        }
        // Thêm kiểm tra để đảm bảo phòng có cấu hình
        if (!room.seat_rows || !room.seat_columns) {
            console.error(`Phòng chiếu ${roomId} không có cấu hình hàng hoặc cột.`);
            return res.status(500).json({ message: `Phòng chiếu ${room.room_number} chưa được cấu hình sơ đồ.` });
        }

        // 2. Tạo sơ đồ ghế động dựa trên cấu hình phòng
        const generatedSeats = generateSeatsFromRoom(room);

        // 3. Lấy các ghế đã được đặt cho suất chiếu này
        const bookings = await Booking.find({
            showtimeId: new mongoose.Types.ObjectId(showtimeId),
            date,
            time,
            // Lấy cả vé đã xác nhận và vé đang chờ thanh toán chưa hết hạn
            $or: [
                { status: "confirmed" },
                { status: "pending", expireAt: { $gt: new Date() } }
            ]
        }).lean();

        const bookedSeatNumbers = new Set(bookings.flatMap(b => b.seats));

        // 4. Merge dữ liệu: đánh dấu ghế nào đã đặt
        const finalSeatLayout = generatedSeats.map((seat) => ({
            ...seat,
            isBooked: bookedSeatNumbers.has(seat.seatNumber),
        }));

        // 5. Trả về mảng ghế
        res.json(finalSeatLayout);
    } catch (err) {
        console.error("❌ Lỗi khi lấy sơ đồ ghế:", err);
        res.status(500).json({ error: "Lỗi server", detail: err.message });
    }
});

module.exports = router;
