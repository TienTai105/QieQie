const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
    movies: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
        index: true
    },
    cinemas: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true,
        index: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
        index: true
    },
    times: [{
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/  // Format HH:MM
    }],
    startDate: {
        type: String,
        match: /^\d{4}-\d{2}-\d{2}$/,
        sparse: true
    },
    endDate: {
        type: String,
        match: /^\d{4}-\d{2}-\d{2}$/,
        sparse: true
    },
    date: {
        type: String,
        match: /^\d{4}-\d{2}-\d{2}$/,
        sparse: true
    }
}, {
    timestamps: true
});

// Compound indexes
ShowtimeSchema.index({ movies: 1, startDate: 1 });
ShowtimeSchema.index({ movies: 1, date: 1 });
ShowtimeSchema.index({ cinemas: 1, startDate: 1 });
ShowtimeSchema.index({ cinemas: 1, date: 1 });

// Validation
ShowtimeSchema.pre('validate', function(next) {
    const hasRange = this.startDate && this.endDate;
    const hasDate = this.date;

    if (!hasRange && !hasDate) {
        return next(new Error('Phải có startDate+endDate hoặc date'));
    }
    if (hasRange && hasDate) {
        return next(new Error('Không được có cả startDate+endDate và date cùng lúc'));
    }
    if (hasRange && this.startDate > this.endDate) {
        return next(new Error('startDate phải <= endDate'));
    }
    next();
});

// Virtual field
ShowtimeSchema.virtual('type').get(function() {
    if (this.startDate && this.endDate) return 'range';
    if (this.date) return 'single';
    return 'unknown';
});

// Method để lấy tất cả ngày trong range
ShowtimeSchema.methods.getDates = function() {
    if (this.type === 'single') return [this.date];
    if (this.type === 'range') {
        const dates = [];
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(d.toISOString().slice(0, 10));
        }
        return dates;
    }
    return [];
};

ShowtimeSchema.set('toJSON', { virtuals: true });
ShowtimeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Showtime', ShowtimeSchema, 'showtime');
