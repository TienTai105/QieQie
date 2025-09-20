import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeatSelector from '../components/SeatSelector';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const TICKET_PRICE = 80000;

const BookingPage = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loadingMovie, setLoadingMovie] = useState(true);
    const [loadingShowtimes, setLoadingShowtimes] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [combos, setCombos] = useState([]);
    const [selectedCombos, setSelectedCombos] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Tải phim
    useEffect(() => {
        setLoadingMovie(true);
        axios.get(`${API_BASE}/api/movies/${movieId}`)
            .then(res => setMovie(res.data))
            .catch(() => setError('Không thể tải phim.'))
            .finally(() => setLoadingMovie(false));
    }, [movieId]);

    // Helper format YYYY-MM-DD
    const toYMD = (d) => d.toISOString().slice(0, 10);

    // Tải lịch chiếu
    useEffect(() => {
        setLoadingShowtimes(true);
        const today = new Date();
        const from = toYMD(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        const toDate = new Date(today);
        toDate.setDate(today.getDate() + 30);
        const to = toYMD(toDate);

        axios.get(`${API_BASE}/api/showtime`, {
            params: { movieId, from, to }
        })
            .then(res => {
                const raw = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];
                const list = raw.flatMap((it) => {
                    const baseShowtime = {
                        _id: it._id || it.id,
                        times: Array.isArray(it.times) ? it.times : [],
                        cinemas: {
                            name: it.cinemas?.name || 'Rạp',
                            address: it.cinemas?.address || '',
                            city: it.cinemas?.city || '',
                            _id: it.cinemas?._id || it.cinemas || null,
                        },
                        roomId: it.roomId || it.room,
                    };
                    if (it.startDate && it.endDate) {
                        const dates = [];
                        const start = new Date(it.startDate + 'T00:00:00Z');
                        const end = new Date(it.endDate + 'T00:00:00Z');
                        for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
                            dates.push(d.toISOString().slice(0, 10));
                        }
                        return dates.map((date) => ({
                            ...baseShowtime,
                            date: date,
                        }));
                    }
                    if (it.date) {
                        return [{ ...baseShowtime, date: it.date }];
                    }
                    return [];
                });
                setShowtimes(list);
                const days = Array.from(new Set(list.map((x) => x.date))).sort();
                setAvailableDates(days);
                if (!selectedDate && days.length) {
                    setSelectedDate(days[0]);
                }
            })
            .catch(() => {
                setShowtimes([]);
                setAvailableDates([]);
                setSelectedDate('');
            })
            .finally(() => setLoadingShowtimes(false));
    }, [movieId]);

    // Tải dữ liệu combo
    useEffect(() => {
        axios.get(`${API_BASE}/api/combos`)
            .then(res => setCombos(res.data))
            .catch(() => {});
    }, []);

    // Lọc theo ngày
    const filteredByDate = useMemo(() => {
        return showtimes.filter((s) => s.date === selectedDate);
    }, [showtimes, selectedDate]);

    // Nhóm theo rạp
    const groupedByCinema = useMemo(() => {
        const map = new Map();
        for (const st of filteredByDate) {
            const key = st.cinemas?._id || st.cinemas?.name;
            if (!map.has(key)) {
                map.set(key, {
                    cinemaId: st.cinemas?._id,
                    cinemaName: st.cinemas?.name || 'Rạp',
                    address: st.cinemas?.address || '',
                    city: st.cinemas?.city || '',
                    items: [],
                });
            }
            map.get(key).items.push(st);
        }
        return Array.from(map.values());
    }, [filteredByDate]);

    const handleToggleSeat = (seatNumber) => {
        setSelectedSeats(prev =>
            prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]
        );
    };

    // Chọn combo
    const handleSelectCombo = (comboItem, amount) => {
        setSelectedCombos(prev => {
            const currentQty = prev[comboItem._id]?.quantity || 0;
            const newQty = Math.max(0, currentQty + amount);
            if (newQty === 0) {
                const { [comboItem._id]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [comboItem._id]: { ...comboItem, quantity: newQty },
            };
        });
    };

    const total = useMemo(() => {
        const seatTotal = selectedSeats.length * TICKET_PRICE;
        const comboTotal = Object.values(selectedCombos).reduce((sum, item) => sum + item.price * item.quantity, 0);
        return seatTotal + comboTotal;
    }, [selectedSeats.length, selectedCombos]);

    const canBook = useMemo(
        () => Boolean(selected && selectedSeats.length > 0),
        [selected, selectedSeats.length]
    );

    // Đặt vé
    const handleBooking = async () => {
        if (!canBook) return;
        setIsProcessing(true);

        try {
            const comboData = Object.values(selectedCombos).map((c) => ({
                comboId: c._id,
                quantity: c.quantity,
                price: c.price,
            }));

            const token = localStorage.getItem('token');
            const bookingPayload = {
                movieId,
                cinemaId: selected.cinemaId,
                showtimeId: selected.showtimeId,
                date: selected.date,
                time: selected.time,
                seats: selectedSeats,
                combos: comboData,
            };

            const response = await axios.post(
                `${API_BASE}/api/bookings`,
                bookingPayload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const newBooking = response.data;
            navigate(`/payment/${newBooking._id}`);
        } catch (err) {
            alert(err.response?.data?.message || '❌ Đặt vé thất bại! Vui lòng thử lại.');
            setIsProcessing(false);
        }
    };

    if (loadingMovie && !movie) {
        return <div className="pt-20 md:pt-24 bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white">
            <div className="max-w-6xl mx-auto px-4 py-8">Đang tải phim...</div>
        </div>;
    }
    if (!movie) {
        return <div className="bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white">
            <div className="max-w-6xl mx-auto px-4 py-10">{error || 'Không có dữ liệu phim.'}</div>
        </div>;
    }

    const hasShowtimes = Array.isArray(showtimes) && showtimes.length > 0;

    return (
        <div className="bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header phim */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    <div>
                        {movie.poster ? (
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-[400px] object-cover rounded-xl shadow-2xl shadow-black/40 ring-1 ring-white/10"
                            />
                        ) : (
                            <div className="w-full h-[400px] rounded-xl bg-slate-700/40" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-extrabold tracking-wide">{movie.title || '—'}</h1>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>Thời lượng: {movie.duration ? `${movie.duration} phút` : '—'}</div>
                            <div>Ngôn ngữ: {movie.language || '—'}</div>
                            <div>Thể loại: {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre || '—'}</div>
                            <div>Khởi chiếu: {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : '—'}</div>
                        </div>
                        <div className="mt-5 leading-7 opacity-95">
                            <h3 className="text-lg font-semibold mb-1">Mô tả</h3>
                            <p className="text-slate-100">{movie.description || 'Chưa có mô tả.'}</p>
                        </div>
                    </div>
                </div>

                {/* Lịch chiếu + Ghế + Tóm tắt */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                    {/* Cột trái */}
                    <div className="space-y-8">
                        {/* Lịch chiếu */}
                        <section className="rounded-xl bg-white/5 ring-1 ring-white/10 p-5">
                            <h2 className="text-xl font-bold">Lịch chiếu</h2>
                            {loadingShowtimes ? (
                                <div className="mt-3 h-10 w-48 rounded bg-slate-700/40 animate-pulse" />
                            ) : !hasShowtimes ? (
                                <div className="mt-3 space-y-2">
                                    <div className="inline-flex items-center gap-2 rounded-lg border border-red-400/60 bg-red-400/10 text-red-300 px-3 py-2">
                                        ⛔ Hiện chưa có lịch chiếu
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        Kiểm tra lại sau hoặc liên hệ rạp phim để biết thêm thông tin.
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Tabs ngày */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {availableDates.map((d) => {
                                            const active = selectedDate === d;
                                            const label = new Date(d).toLocaleDateString('vi-VN', {
                                                weekday: 'short',
                                                day: '2-digit',
                                                month: '2-digit',
                                            });
                                            return (
                                                <button
                                                    key={d}
                                                    onClick={() => {
                                                        setSelectedDate(d);
                                                        setSelected(null);
                                                        setSelectedSeats([]);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                                                        active ? 'bg-yellow-400 text-black border-yellow-400' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Danh sách rạp + giờ */}
                                    <div className="mt-4 space-y-4">
                                        {groupedByCinema.length === 0 ? (
                                            <div className="text-slate-200/80">Không có suất chiếu phù hợp bộ lọc.</div>
                                        ) : (
                                            groupedByCinema.map((grp) => (
                                                <div key={grp.cinemaId || grp.cinemaName} className="rounded-lg bg-white/5 ring-1 ring-white/10 p-4">
                                                    <div>
                                                        <div className="text-base font-semibold text-yellow-300">{grp.cinemaName}</div>
                                                        <div className="text-sm opacity-80">
                                                            {grp.address ? grp.address : '—'} {grp.city ? `(${grp.city})` : ''}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {grp.items
                                                            .filter((x) => x.date === selectedDate)
                                                            .flatMap((x) =>
                                                                (x.times || []).map((t) => ({
                                                                    showtimeId: x._id,
                                                                    date: x.date,
                                                                    roomId: x.roomId,
                                                                    time: t,
                                                                    cinemaName: grp.cinemaName,
                                                                    cinemaId: grp.cinemaId,
                                                                }))
                                                            )
                                                            .sort((a, b) => a.time.localeCompare(b.time))
                                                            .map((slot) => {
                                                                const active = selected?.showtimeId === slot.showtimeId && selected?.date === slot.date && selected?.time === slot.time;
                                                                const isDisabled = !slot.roomId;
                                                                return (
                                                                    <button
                                                                        key={`${slot.showtimeId}-${slot.time}`}
                                                                        onClick={() => {
                                                                            if (isDisabled) return;
                                                                            setSelected(slot);
                                                                            setSelectedSeats([]);
                                                                        }}
                                                                        disabled={isDisabled}
                                                                        className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                                                                            active ? 'bg-yellow-400 text-black border-yellow-400' : 
                                                                            isDisabled ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                                                        }`}
                                                                        title={isDisabled ? "Suất chiếu này chưa sẵn sàng để đặt vé" : slot.cinemaName}
                                                                    >
                                                                        {slot.time}
                                                                    </button>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </section>

                        {/* Ghế */}
                        {selected && (
                            <>
                                <SeatSelector
                                    key={`${selected.showtimeId}-${selected.date}-${selected.time}`}
                                    showtimeId={selected.showtimeId}
                                    date={selected.date}
                                    time={selected.time}
                                    roomId={selected.roomId}
                                    selectedSeats={selectedSeats}
                                    onToggleSeat={handleToggleSeat}
                                />

                                {/* Combo */}
                                <section className="rounded-xl bg-white/5 ring-1 ring-white/10 p-5 mt-6">
                                  <h3 className="text-xl font-bold mb-4 text-yellow-300">🍿 Chọn Combo</h3>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {combos.map((combo) => (
                                        <div
                                          key={combo._id}
                                          className="bg-slate-800 rounded-xl p-4 flex flex-col items-center text-center shadow-md hover:scale-105 transition"
                                        >
                                          <img
                                            src={combo.image || '/images/combocogau.png'}
                                            alt={combo.name}
                                            className="w-28 h-28 object-cover mb-3 rounded-lg border border-white/10"
                                            onError={(e) =>
                                              (e.target.src = "/images/combocogau.png")
                                            }
                                          />
                                          <h4 className="font-semibold text-white">{combo.name}</h4>
                                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{combo.description}</p>
                                          <p className="font-bold text-yellow-400 mt-2">
                                            {combo.price.toLocaleString("vi-VN")} đ
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <button
                                              onClick={() => handleSelectCombo(combo, -1)}
                                              className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full hover:bg-gray-500 transition"
                                            >
                                              -
                                            </button>
                                            <span className="font-bold w-6 text-center">
                                              {selectedCombos[combo._id]?.quantity || 0}
                                            </span>
                                            <button
                                              onClick={() => handleSelectCombo(combo, 1)}
                                              className="w-8 h-8 flex items-center justify-center bg-yellow-400 text-black rounded-full hover:bg-yellow-300 transition"
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                    ))}
                                  </div>
                                </section>
                            </>
                        )}
                    </div>

                    {/* Cột phải: Tóm tắt đặt vé */}
                    <aside className="rounded-xl bg-white/5 ring-1 ring-white/10 p-5 h-fit lg:sticky lg:top-24">
                        <h3 className="text-lg font-semibold mb-3">Tóm tắt đặt vé</h3>
                        <div className="space-y-2 text-sm mb-4 border-b border-white/10 pb-4">
                            <div className="flex justify-between">
                                <span className="opacity-80">Phim:</span>
                                <span className="font-semibold text-right">{movie?.title || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-80">Rạp:</span>
                                <span className="font-semibold text-right">{selected?.cinemaName || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-80">Suất chiếu:</span>
                                <span className="font-semibold text-right">
                                    {selected ? `${selected.time} - ${new Date(selected.date).toLocaleDateString('vi-VN')}` : '—'}
                                </span>
                            </div>
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
                        {Object.keys(selectedCombos).length > 0 && (
                            <div className="mt-3">
                            <div className="mb-1">Bắp nước</div>
                            <div className="space-y-1">
                                {Object.values(selectedCombos).map((c) => (
                                <div key={c._id} className="flex justify-between text-xs">
                                    <span>{c.name} x{c.quantity}</span>
                                    <span className="font-semibold">
                                    {(c.price * c.quantity).toLocaleString("vi-VN")} đ
                                    </span>
                                </div>
                                ))}
                            </div>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-white/10 mt-3">
                            <span>Tạm tính</span>
                            <span className="font-bold">{total.toLocaleString("vi-VN")} đ</span>
                        </div>
                        <button
                            onClick={handleBooking}
                            disabled={!canBook || isProcessing}
                            className={`mt-4 w-full px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center ${
                            canBook
                                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                                : "bg-slate-600 text-slate-300 cursor-not-allowed"
                            }`}
                        >
                            {isProcessing ? <span className="mr-2">...</span> : '🎟 Đặt vé'}
                        </button>
                        <p className="text-xs opacity-70 mt-2">Giá vé tạm tính: {TICKET_PRICE.toLocaleString('vi-VN')} đ/ghế</p>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;