// JavaScript
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('orderId') || searchParams.get('vnp_TxnRef');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!bookingId) {
            setError('Không tìm thấy mã đặt vé.');
            setLoading(false);
            return;
        }
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE}/api/bookings/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(res.data);
            } catch (err) {
                console.error("Lỗi tải thông tin đặt vé:", err);
                const msg = err.response?.data?.message || 'Không thể tải thông tin đặt vé. Vui lòng liên hệ hỗ trợ.';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    // Auto chuyển sang Lịch sử sau 3 giây (nếu có token)
    useEffect(() => {
        if (!loading && !error && (booking?._id || bookingId)) {
            const timer = setTimeout(() => {
                navigate(`/history?open=${booking?._id || bookingId}`, { replace: true });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [loading, error, booking, bookingId, navigate]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white p-4">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
            <p className="mt-4 text-lg">Đang tải thông tin vé...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white p-4">
            <div className="bg-red-500/10 rounded-2xl p-8 text-center shadow-2xl max-w-lg w-full">
                <AlertTriangle className="text-red-400 w-20 h-20 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Đã xảy ra lỗi</h1>
                <p className="text-slate-300 mb-8">{error}</p>
                <Link to="/" className="inline-block bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition-colors">Về trang chủ</Link>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white p-4">
            <div className="bg-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl max-w-lg w-full">
                <CheckCircle className="text-green-400 w-20 h-20 mx-auto mb-6" />
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Thanh toán thành công!</h1>
                <p className="text-slate-300 mb-2">Cảm ơn bạn đã đặt vé. Chúc bạn có một buổi xem phim vui vẻ!</p>
                <p className="text-slate-300 text-sm mb-6">Sẽ chuyển đến "Lịch sử" để mở vé trong giây lát...</p>

                <div className="bg-white/5 p-4 rounded-lg text-left space-y-2 mb-8 border border-white/10">
                    <p><strong>Phim:</strong> {booking?.movieId?.title}</p>
                    <p><strong>Rạp:</strong> {booking?.cinemaId?.name}</p>
                    <p><strong>Suất chiếu:</strong> {booking?.time} - {new Date(booking?.date).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Ghế:</strong> {booking?.seats?.join(', ')}</p>
                    {booking?.combos && booking.combos.length > 0 && (
                        <>
                            <hr className="border-white/10 my-2" />
                            <p><strong>Bắp nước:</strong></p>
                            <ul className="list-disc list-inside pl-2 text-sm">
                                {booking.combos.map(item => (
                                    <li key={item.comboId._id}>{item.comboId.name} x{item.quantity}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(`/history?open=${booking?._id || bookingId}`)}
                        className="inline-block bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                        Xem vé của tôi
                    </button>
                    <Link
                        to="/"
                        className="inline-block bg-white/10 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;