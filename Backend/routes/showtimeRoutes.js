const express = require("express");
const mongoose = require("mongoose");
const Showtime = require("../models/Showtime");

const router = express.Router();

// helper: check YYYY-MM-DD
const isYMD = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

// helper: hôm nay
const todayYMD = () => new Date().toISOString().slice(0, 10);

// GET /api/showtime?movieId=xxx&from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/", async (req, res) => {
    try {
        const { movieId, from, to } = req.query;

        if (!movieId) {
            return res.status(400).json({ message: "movieId là bắt buộc" });
        }

        // ép ObjectId
        let validMovieId;
        try {
            validMovieId = new mongoose.Types.ObjectId(movieId);
        } catch (err) {
            return res.status(400).json({ message: "movieId không hợp lệ" });
        }

        // xác định khoảng ngày query
        const queryStartDate = isYMD(from) ? from : todayYMD();
        const queryEndDate = isYMD(to)
            ? to
            : (() => {
                const add = new Date(queryStartDate);
                add.setDate(add.getDate() + 30);
                return add.toISOString().slice(0, 10);
            })();

        console.log("🎬 Query showtime:", { movieId, queryStartDate, queryEndDate });

        // filter
        const filter = {
            movies: validMovieId,
            $or: [
                // TH1: có field date đơn (YYYY-MM-DD)
                { date: { $gte: queryStartDate, $lte: queryEndDate } },
                // TH2: có khoảng (startDate - endDate) giao với range query
                { startDate: { $lte: queryEndDate }, endDate: { $gte: queryStartDate } },
            ],
        };

        const rawShowtimes = await Showtime.find(filter)
            .populate("movies", "title")
            .populate("cinemas", "name address city")
            .sort({ startDate: 1, date: 1, _id: 1 })
            .lean();

        console.log("📊 Found:", rawShowtimes.length);

        if (!rawShowtimes.length) {
            return res.json([]);
        }

        // chuyển về danh sách ngày cụ thể
        const expanded = [];

        for (const r of rawShowtimes) {
            if (r.date) {
                // lịch chiếu 1 ngày cụ thể
                expanded.push({
                    _id: r._id,
                    date: r.date,
                    times: r.times || [],
                    room: r.room,
                    movies: r.movies,
                    cinemas: r.cinemas,
                });
            } else if (r.startDate && r.endDate) {
                // lịch chiếu dạng khoảng
                const start = new Date(r.startDate);
                const end = new Date(r.endDate);
                const qStart = new Date(queryStartDate);
                const qEnd = new Date(queryEndDate);

                const fromD = start > qStart ? start : qStart;
                const toD = end < qEnd ? end : qEnd;

                for (let d = new Date(fromD); d <= toD; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().slice(0, 10);
                    expanded.push({
                        _id: r._id,
                        date: dateStr,
                        times: r.times || [],
                        room: r.room,
                        movies: r.movies,
                        cinemas: r.cinemas,
                    });
                }
            }
        }

        expanded.sort((a, b) => a.date.localeCompare(b.date));

        res.json(expanded);
    } catch (err) {
        console.error("❌ Lỗi lấy showtimes:", err);
        res.status(500).json({ error: "Lỗi server", detail: err.message });
    }
});

module.exports = router;
