import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeatSelector from '../components/SeatSelector';
import ComboSelector from '../components/ComboSelector';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const TICKET_PRICE = 80000;

const SeatSelectionPage = () => {
    const { showtimeId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy tham số từ URL
    const movieId = searchParams.get('movieId');
    const cinemaId = searchParams.get('cinemaId');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const roomId = searchParams.get('roomId');

    // State
    const [movie, setMovie] = useState(null);
    const [cinema, setCinema] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedCombos, setSelectedCombos] = useState({});
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Tải phim + rạp
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!movieId || !cinemaId) {
                setError('Thiếu thông tin phim hoặc rạp.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const [movieRes, cinemaRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/movies/${movieId}`),
                    axios.get(`${API_BASE}/api/cinemas/${cinemaId}`),
                ]);
                setMovie(movieRes.data);
                setCinema(cinemaRes.data);
            } catch (err) {
                console.error('Lỗi tải phim/rạp:', err);
                setError('Không thể tải thông tin cần thiết cho việc đặt vé.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [movieId, cinemaId]);

    // Tổng tiền
    const total = useMemo(() => {
        const seatTotal = selectedSeats.length * TICKET_PRICE;
        const comboTotal = Object.values(selectedCombos).reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        return seatTotal + comboTotal;
    }, [selectedSeats, selectedCombos]);

    const canBook = selectedSeats.length > 0 && userName.trim();

    // Chọn combo
    const handleComboSelect = (combo, delta) => {
        setSelectedCombos((prev) => {
            const currentQty = prev[combo._id]?.quantity || 0;
            const newQty = Math.max(currentQty + delta, 0);

            if (newQty === 0) {
                const { [combo._id]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [combo._id]: { ...combo, quantity: newQty },
            };
        });
    };

    // Đặt vé
    const handleBooking = async () => {
        if (!canBook) return;
        try {
            const comboData = Object.values(selectedCombos).map((c) => ({
                comboId: c._id,
                quantity: c.quantity,
                price: c.price,
            }));

            await axios.post(`${API_BASE}/api/bookings`, {
                movieId,
                cinemaId,
                showtimeId,
                date,
                time,
                roomId,
                seats: selectedSeats,
                userName: userName.trim(),
                combos: comboData,
                totalPrice: total,
            });
            navigate('/success');
        } catch (err) {
            console.error('❌ Lỗi đặt vé:', err);
            alert('Đặt vé thất bại! Vui lòng thử lại.');
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white min-h-screen flex justify-center items-center">
                Đang tải dữ liệu...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white min-h-screen flex justify-center items-center">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white min-h-screen py-10">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                {/* Cột trái */}
                <div className="flex flex-col gap-10">
                    {/* Header phim */}
                    {movie && (
                        <div className="flex items-center gap-4">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-20 h-28 object-cover rounded-lg"
                            />
                            <div>
                                <h1 className="text-2xl font-bold">{movie.title}</h1>
                                <p className="text-sm opacity-80">
                                    {cinema?.name || '—'} •{' '}
                                    {date ? new Date(date).toLocaleDateString('vi-VN') : ''} •{' '}
                                    {time}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Seat Selector */}
                    <SeatSelector
                        showtimeId={'6886366856dd8191a938d676'}
                        date={'2025-09-05'}
                        time={'09:00'}
                        roomId={2}
                        onConfirm={setSelectedSeats}
                    />

                    {/* Combo Selector */}
                    <ComboSelector
                        onSelect={handleComboSelect}
                        selectedCombos={selectedCombos}
                    />
                </div>

                {/* Cột phải: Tóm tắt */}
                <aside className="rounded-xl bg-white/5 ring-1 ring-white/10 p-5 h-fit lg:sticky lg:top-24">
                    <h3 className="text-lg font-semibold mb-3">Tóm tắt đặt vé</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span>Phim</span>
                            <span className="font-semibold text-right">
                {movie?.title || '—'}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Ngày</span>
                            <span className="font-semibold">
                {date ? new Date(date).toLocaleDateString('vi-VN') : '—'}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Giờ</span>
                            <span className="font-semibold">{time || '—'}</span>
                        </div>
                        <div>
                            <div className="mb-1">Ghế đã chọn</div>
                            <div className="flex flex-wrap gap-1">
                                {selectedSeats.length > 0 ? (
                                    selectedSeats.sort().map((s) => (
                                        <span
                                            key={s}
                                            className="px-2 py-0.5 rounded bg-green-500/90 text-black text-xs font-bold"
                                        >
                      {s}
                    </span>
                                    ))
                                ) : (
                                    <span className="opacity-70">Chưa chọn ghế</span>
                                )}
                            </div>
                        </div>

                        {/* Combo đã chọn */}
                        {Object.keys(selectedCombos).length > 0 && (
                            <div>
                                <div className="mb-1">Bắp nước</div>
                                <div className="space-y-1">
                                    {Object.values(selectedCombos).map((c) => (
                                        <div
                                            key={c._id}
                                            className="flex justify-between items-center text-xs"
                                        >
                      <span>
                        {c.name} x{c.quantity}
                      </span>
                                            <span className="font-semibold">
                        {(c.price * c.quantity).toLocaleString('vi-VN')} đ
                      </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-2 border-t border-white/10">
                            <span>Tạm tính</span>
                            <span className="font-bold">
                {total.toLocaleString('vi-VN')} đ
              </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm mb-1">Tên người đặt</label>
                        <input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Nhập tên của bạn"
                            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={!canBook}
                        className={`mt-4 w-full px-4 py-2 rounded-lg font-semibold transition ${
                            canBook
                                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                                : 'bg-slate-600 text-slate-300 cursor-not-allowed'
                        }`}
                    >
                        🎟 Đặt vé
                    </button>

                    <p className="text-xs opacity-70 mt-2">
                        Giá vé tạm tính: {TICKET_PRICE.toLocaleString('vi-VN')} đ/ghế
                    </p>
                </aside>
            </div>
        </div>
    );
};

export default SeatSelectionPage;
