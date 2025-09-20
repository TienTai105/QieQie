const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true },
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    time: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    seats: {
        type: [String],
        required: true,
        validate: {
            validator: arr => Array.isArray(arr) && arr.length > 0,
            message: "Phải chọn ít nhất một ghế."
        }
    },
    combos: [{
        comboId: { type: mongoose.Schema.Types.ObjectId, ref: 'Combo', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "failed"], default: "pending" },
    expireAt: { type: Date },
}, {
    timestamps: { currentTime: () => dayjs().tz('Asia/Ho_Chi_Minh').toDate() } // createdAt & updatedAt giờ VN
});

bookingSchema.index({ showtimeId: 1, date: 1, time: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { status: 'pending' } });

bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);
