<<<<<<< HEAD
import React, { useState } from 'react';

const rows = 5;
const cols = 8;

// Giả lập ghế đã đặt sẵn
const bookedSeats = ['B2', 'C3', 'D4', 'E5'];

const SeatSelector = ({ onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // Không thể chọn ghế đã đặt

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    onConfirm(selectedSeats);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Chọn ghế ngồi</h2>

      <div className="grid grid-cols-8 gap-2 mb-4">
        {[...Array(rows)].map((_, rowIndex) => {
          const rowLabel = String.fromCharCode(65 + rowIndex); // A, B, C...
          return [...Array(cols)].map((_, colIndex) => {
            const seat = `${rowLabel}${colIndex + 1}`;
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            let bgColor = 'bg-white';
            if (isBooked) bgColor = 'bg-gray-400 cursor-not-allowed';
            else if (isSelected) bgColor = 'bg-red-500 text-white';

            return (
              <button
                key={seat}
                className={`w-10 h-10 text-sm font-medium rounded ${bgColor} border hover:bg-red-300 transition`}
                onClick={() => toggleSeat(seat)}
                disabled={isBooked}
                title={seat}
              >
                {seat}
              </button>
            );
          });
        })}
      </div>

      <div className="mt-4">
        {selectedSeats.length > 0 && (
          <p className="mb-2 text-green-700">
            Ghế đã chọn: {selectedSeats.join(', ')}
          </p>
        )}
        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
          className={`px-6 py-3 rounded text-white text-lg ${
            selectedSeats.length > 0
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Xác nhận ghế
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;
=======
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SeatSelector = ({ showtimeId, date, time, roomId, selectedSeats, onToggleSeat }) => {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!showtimeId || !date || !time || !roomId) return;

        const controller = new AbortController();
        setLoading(true);
        setError('');

        axios
            .get(`${API_BASE}/api/seats`, {
                params: { showtimeId, date, time, roomId },
                signal: controller.signal,
            })
            .then((res) => {
                setSeats(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                if (err.name !== 'CanceledError') {
                    console.error("❌ Lỗi tải sơ đồ ghế:", err);
                    setError('Không thể tải sơ đồ ghế. Vui lòng thử lại.');
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [showtimeId, date, time, roomId]);

    // Nhóm ghế theo hàng
    const seatGrid = useMemo(() => {
        if (seats.length === 0) return [];
        const grid = {};
        seats.forEach((seat) => {
            const row = seat.seatNumber.charAt(0);
            if (!grid[row]) grid[row] = [];
            grid[row].push(seat);
        });
        Object.values(grid).forEach((row) =>
            row.sort(
                (a, b) =>
                    parseInt(a.seatNumber.substring(1)) -
                    parseInt(b.seatNumber.substring(1))
            )
        );
        return Object.entries(grid).sort((a, b) => a[0].localeCompare(b[0]));
    }, [seats]);

    if (loading) {
        return (
            <div className="text-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-white text-lg">Đang tải sơ đồ ghế...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
                    <div className="text-red-400 text-xl mb-2">⚠️</div>
                    <p className="text-red-400 text-lg">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 🎬 Màn hình chiếu xịn xò */}
            <div className="text-center mb-16">
              <div className="relative mx-auto w-full max-w-5xl">

                {/* Thanh màn hình chính */}
                <div className="h-5 bg-gradient-to-r from-white via-slate-100 to-white rounded-md shadow-[0_0_40px_rgba(255,255,255,0.7)]"></div>

                {/* Hiệu ứng ánh sáng hắt xuống */}
                <div className="absolute left-0 right-0 h-20 bg-gradient-to-b from-white/30 via-white/5 to-transparent blur-2xl"></div>

                {/* Vạch sáng viền */}
                <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent blur-sm"></div>

                {/* Chữ “Màn Hình” */}
                <p className="text-gray-200 text-lg font-bold tracking-[0.5em] mt-10 uppercase drop-shadow-lg">
                  🎬 Màn Hình
                </p>
              </div>
            </div>

            {/* Sơ đồ ghế với hiệu ứng 3D */}
            <div className="flex justify-center">
                <div style={{ perspective: '1200px' }} className="w-full max-w-4xl">
                    <div
                        className="space-y-4 pb-8"
                        style={{
                            transform: 'rotateX(-20deg) scale(0.9)',
                            transformOrigin: 'center top'
                        }}
                    >
                        {seatGrid.map(([row, seatsInRow]) => (
                            <div key={row} className="flex items-center justify-center gap-2">
                                {/* Label hàng bên trái */}
                                <div className="w-8 text-center">
                                    <span className="text-gray-400 font-bold text-lg">{row}</span>
                                </div>

                                {/* Ghế */}
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {seatsInRow.map((seat, index) => {
                                        const isBooked = seat.isBooked;
                                        const isSelected = selectedSeats.includes(seat.seatNumber);
                                        const needsGap = index === Math.floor(seatsInRow.length / 2);

                                        // ✅ Logic độ sáng: ghế càng xa màn hình càng tối
                                        const rowIndex = row.charCodeAt(0) - 65; // A=0, B=1...
                                        // Giảm độ sáng 8% cho mỗi hàng, tối thiểu là 40%
                                        const brightness = Math.max(1 - rowIndex * 0.08, 0.4);
                                        const isStandard = seat.type === 'standard';
                                        const dynamicStyle = (isStandard && !isSelected && !isBooked) ? { filter: `brightness(${brightness})` } : {};

                                        let seatClasses = 'relative transition-all duration-300 font-bold text-xs flex items-center justify-center border-2 shadow-md ';

                                        // Kích thước ghế theo loại
                                        if (seat.type === 'couple') {
                                            seatClasses += 'w-20 h-10 rounded-xl ';
                                        } else {
                                            seatClasses += 'w-10 h-10 rounded-lg ';
                                        }

                                        // Màu sắc và trạng thái ghế
                                        if (isBooked) {
                                            seatClasses += 'bg-slate-700/50 border-slate-600 text-slate-500 cursor-not-allowed opacity-70 shadow-inner';
                                        } else if (isSelected) {
                                            seatClasses += 'bg-gradient-to-br from-yellow-400 to-orange-400 border-yellow-300 text-black scale-110 shadow-xl shadow-yellow-400/50 ring-2 ring-white/50';
                                        } else {
                                            switch (seat.type) {
                                                case 'vip':
                                                    seatClasses += 'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400 text-white hover:from-purple-400 hover:to-indigo-500 hover:scale-110 hover:shadow-xl hover:shadow-purple-400/30 cursor-pointer';
                                                    break;
                                                case 'couple':
                                                    seatClasses += 'bg-gradient-to-br from-pink-500 to-rose-500 border-pink-400 text-white hover:from-pink-400 hover:to-rose-400 hover:scale-110 hover:shadow-xl hover:shadow-pink-400/30 cursor-pointer';
                                                    break;
                                                default:
                                                    seatClasses += 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-100/50 text-slate-800 hover:from-slate-100 hover:to-slate-300 hover:scale-110 hover:shadow-xl hover:shadow-slate-400/30 cursor-pointer';
                                            }
                                        }

                                        return (
                                            <React.Fragment key={seat.seatNumber}>
                                                {needsGap && <div className="w-6"></div>}
                                                <button
                                                    type="button"
                                                    onClick={() => !isBooked && onToggleSeat(seat.seatNumber)}
                                                    disabled={isBooked}
                                                    className={seatClasses}
                                                    style={dynamicStyle}
                                                    title={`Ghế ${seat.seatNumber} - ${seat.type === 'vip' ? 'VIP' : seat.type === 'couple' ? 'Đôi' : 'Thường'} ${isBooked ? '(Đã đặt)' : ''}`}
                                                >
                                                    {/* Biểu tượng cho ghế đôi */}
                                                    {seat.type === 'couple' ? (
                                                        <span className="text-lg">💑</span>
                                                    ) : (
                                                        seat.seatNumber
                                                    )}

                                                    {/* Hiệu ứng selected */}
                                                    {isSelected && (
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs">✓</span>
                                                        </div>
                                                    )}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>

                                {/* Label hàng bên phải */}
                                <div className="w-8 text-center">
                                    <span className="text-gray-400 font-bold text-lg">{row}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chú thích loại ghế */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-white font-semibold mb-4 text-center">📝 Chú Thích</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-slate-200 flex items-center justify-center text-slate-800 font-bold text-xs">
                            1
                        </div>
                        <span className="text-gray-300">Ghế thường</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-purple-400 flex items-center justify-center text-white font-bold text-xs">
                            V
                        </div>
                        <span className="text-gray-300">Ghế VIP</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <div className="w-12 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 border-2 border-pink-400 flex items-center justify-center text-white text-xs">
                            💑
                        </div>
                        <span className="text-gray-300">Ghế đôi</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-300 flex items-center justify-center text-black font-bold text-xs relative">
                            ✓
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-300">Đang chọn</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-gray-500 font-bold text-xs">
                            ✕
                        </div>
                        <span className="text-gray-300">Đã đặt</span>
                    </div>
                </div>
            </div>

            {/* Thống kê ghế đã chọn */}
            {selectedSeats.length > 0 && (
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-400/20">
                    <div className="text-center">
                        <p className="text-green-400 font-semibold mb-2">
                            ✅ Đã chọn {selectedSeats.length} ghế
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {selectedSeats.sort().map((seatNumber) => (
                                <span
                                    key={seatNumber}
                                    className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg"
                                >
                                    {seatNumber}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelector;
>>>>>>> b32aa75 (update code)
