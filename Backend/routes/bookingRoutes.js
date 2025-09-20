// JavaScript
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { authMiddleware } = require('../middleware/auth');

dayjs.extend(utc);
dayjs.extend(timezone);

const TICKET_PRICE = 80000;

// Tạo booking pending
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { movieId, cinemaId, showtimeId, date, time, seats, combos } = req.body;
        const user = req.user;

        // Kiểm tra ghế đã được đặt chưa
        const existingBooking = await Booking.findOne({
            showtimeId, date, time,
            seats: { $in: seats },
            $or: [
                { status: "confirmed" },
                { status: "pending", expireAt: { $gt: new Date() } }
            ]
        });

        if (existingBooking) {
            return res.status(409).json({
                message: `Ghế ${existingBooking.seats.find(s => seats.includes(s))} đã được người khác đặt.`
            });
        }

        const seatTotal = seats.length * TICKET_PRICE;
        const comboTotal = Array.isArray(combos)
            ? combos.reduce((sum, item) => sum + item.price * item.quantity, 0)
            : 0;
        const totalPrice = seatTotal + comboTotal;

        const expireAt = dayjs().tz('Asia/Ho_Chi_Minh').add(120, 'minute').toDate();

        const newBooking = new Booking({
            user: user._id,
            movieId, cinemaId, showtimeId,
            date, time, seats, combos,
            totalPrice,
            status: 'pending',
            expireAt
        });

        await newBooking.save();
        res.status(201).json(newBooking);

    } catch (err) {
        console.error("❌ Lỗi tạo pending booking:", err);
        res.status(500).json({ error: 'Tạo đặt vé thất bại', details: err.message });
    }
});

// Lịch sử đặt vé: hỗ trợ lọc status qua query (?status=confirmed|active|all)
// - confirmed: chỉ đơn confirmed
// - active (mặc định): confirmed + pending chưa hết hạn
// - all: tất cả trạng thái
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const status = (req.query.status || 'active').toLowerCase();
        const page = Math.max(parseInt(req.query.page || '1', 10), 1);
        const limitRaw = Math.max(parseInt(req.query.limit || '10', 10), 1);
        const limit = Math.min(limitRaw, 50);
        const now = new Date();

        // Lọc theo thời gian tạo đơn (createdAt)
        const from = req.query.from ? new Date(req.query.from) : null;
        const to = req.query.to ? new Date(req.query.to) : null;

        let filter = { user: req.user._id };
        if (status === 'confirmed') {
            filter.status = 'confirmed';
        } else if (status === 'cancelled') {
            filter.status = 'cancelled';
        } else if (status === 'active') {
            filter.$or = [
                { status: 'confirmed' },
                { status: 'pending', expireAt: { $gt: now } }
            ];
        }
        if (from || to) {
            filter.createdAt = {};
            if (from && !isNaN(from.getTime())) filter.createdAt.$gte = from;
            if (to && !isNaN(to.getTime())) {
                // Bao gồm cả hết ngày 'to' nếu chỉ truyền yyyy-mm-dd
                const end = new Date(to);
                if (req.query.to.length <= 10) end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
            if (Object.keys(filter.createdAt).length === 0) delete filter.createdAt;
        }

        const [total, bookings, statusCounts] = await Promise.all([
            Booking.countDocuments(filter),
            Booking.find(filter)
                .populate('movieId', 'title poster duration genre')
                .populate('cinemaId', 'name address')
                .populate('showtimeId', 'date time')
                .populate({ path: 'combos.comboId', select: 'name price' })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Booking.aggregate([
                { $match: { user: req.user._id } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ])
        ]);

        return res.json({
            success: true,
            data: bookings,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            debug: {
                statusFilter: status,
                statusCounts
            }
        });
    } catch (error) {
        console.error("❌ Lỗi lấy lịch sử đặt vé:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});


// Lấy booking theo ID (đặt SAU route /history)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'username email phone')
            .populate('movieId', 'title poster')
            .populate('cinemaId', 'name')
            .populate('showtimeId', 'date time')
            .populate({ path: 'combos.comboId', model: 'Combo', select: 'name' });

        if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt vé' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Xác nhận đơn đặt vé
router.put('/:id/confirm', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đơn đặt vé.' });
        }

        // Chỉ xác nhận nếu đơn đang ở trạng thái "pending"
        if (booking.status !== 'pending') {
            if (booking.status === 'confirmed') return res.json({ message: 'Đơn đã được xác nhận trước đó.' });
            return res.status(400).json({ message: `Không thể xác nhận đơn ở trạng thái ${booking.status}.` });
        }

        // Cập nhật trạng thái và xóa thời gian hết hạn
        booking.status = 'confirmed';
        booking.expireAt = undefined;

        await booking.save();
        res.json({ message: 'Xác nhận đặt vé thành công.', booking });
    } catch (error) {
        console.error("❌ Lỗi xác nhận đặt vé:", error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// hủy vé
router.put('/:id/cancel', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đơn đặt vé.' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Bạn không có quyền hủy vé này.' });
        }

        if (booking.status !== 'confirmed') {
            return res.status(400).json({ message: `Không thể hủy vé ở trạng thái "${booking.status}".` });
        }

        // Helper: ưu tiên lấy ngày/giờ từ showtimeId, fallback về booking.date/time
        const getShowDateTime = (b) => {
            const d = b?.showtimeId?.date || b?.date;
            const t = b?.showtimeId?.time || b?.time;
            if (!d || !t) return null;
            const dt = new Date(`${d} ${t}`);
            return isNaN(dt.getTime()) ? null : dt;
        };

// Sửa canCancel: confirmed + còn ≥ 2 tiếng trước giờ chiếu
        const canCancel = (b) => {
            if (b?.status !== 'confirmed') return false;
            const dt = getShowDateTime(b);
            if (!dt) return false;
            const diffHours = (dt.getTime() - Date.now()) / 3600000;
            return diffHours >= 2;
        };

// Sửa buildQrPayload: dùng showtimeId.date/time nếu có
        const buildQrPayload = (b) => {
            const d = b?.showtimeId?.date || b?.date;
            const t = b?.showtimeId?.time || b?.time;
            const payload = {
                bookingId: b?._id,
                userId: b?.user?._id || b?.user,
                movie: b?.movieId?.title,
                cinema: b?.cinemaId?.name,
                date: d,
                time: t,
                seats: b?.seats,
                v: 1
            };
            return JSON.stringify(payload);
        };


        booking.status = 'cancelled';
        await booking.save();
        res.json({ message: 'Hủy vé thành công.' });
    } catch (error) {
        console.error("❌ Lỗi khi hủy vé:", error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;