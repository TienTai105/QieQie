import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Clock, AlertTriangle } from 'lucide-react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const token = localStorage.getItem('token'); // lấy token user đã login

  // Fetch booking
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingData = res.data;

        // Kiểm tra trạng thái pending + expire
        const expireTime = dayjs(bookingData.expireAt).tz('Asia/Ho_Chi_Minh').valueOf();
        const now = dayjs().tz('Asia/Ho_Chi_Minh').valueOf();

        if (bookingData.status !== 'pending' || expireTime < now) {
          setError('Đơn đặt vé này đã hết hạn hoặc đã được xử lý.');
          setLoading(false);
          return;
        }

        setBooking(bookingData);
        setTimeLeft(Math.round((expireTime - now) / 1000)); // countdown
      } catch (err) {
        console.error('Fetch booking error:', err);
        setError('Không tìm thấy đơn đặt vé hoặc chưa đăng nhập.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, token]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      if (booking && !error) setError('Đơn đặt vé đã hết hạn.');
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, booking, error]);

  // Giả lập thanh toán
  useEffect(() => {
    if (paymentInfo) {
      const simulationTimer = setTimeout(() => {
        navigate(`/payment-success?orderId=${bookingId}`);
      }, 15000); // 15s
      return () => clearTimeout(simulationTimer);
    }
  }, [paymentInfo, bookingId, navigate]);

  // Xử lý thanh toán
  const handlePayment = async (method) => {
    setIsProcessing(true);
    setPaymentInfo(null);
    setPaymentError('');

    if (method === 'momo') {
      setPaymentError('Hệ thống thanh toán MoMo đang bảo trì. Vui lòng chọn phương thức khác.');
      setIsProcessing(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/api/payments/create-payment-url`,
        { bookingId, paymentMethod: method },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { payUrl, qrCodeUrl } = res.data;

      if (!payUrl || !qrCodeUrl) throw new Error('Không nhận được dữ liệu thanh toán từ server');

      setPaymentInfo({ payUrl, qrCodeUrl, method });
    } catch (err) {
      console.error('Payment error:', err);
      const message = err.response?.data?.message || err.message || 'Không thể xử lý thanh toán.';
      setPaymentError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'momo': return 'MoMo';
      case 'vnpay': return 'VNPay';
      case 'zalopay': return 'ZaloPay';
      default: return 'Ngân hàng';
    }
  };

  const getQrImageSettings = (method) => {
    const logos = { vnpay: '/images/vnpay.png', zalopay: '/images/zalopay.png' };
    if (!logos[method]) return undefined;
    return { src: logos[method], height: 40, width: 40, excavate: true };
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white">
      <Loader2 className="animate-spin mr-2" /> Đang tải...
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#0f1436] to-[#2b235f] text-white">
      <div className="text-center bg-red-500/20 p-8 rounded-lg">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-xl font-bold">Đã xảy ra lỗi</h2>
        <p className="mt-2 text-red-300">{error}</p>
        <button onClick={() => navigate('/')} className="mt-6 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold">
          Về trang chủ
        </button>
      </div>
    </div>
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen py-12 px-4 text-white bg-gradient-to-b from-[#0f1436] to-[#2b235f]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-yellow-300 mb-4">Xác nhận và Thanh toán</h1>
        <p className="text-center text-slate-300 mb-8">
          Vui lòng kiểm tra lại thông tin và hoàn tất thanh toán trong thời gian còn lại.
        </p>

        {/* Countdown */}
        <div className="my-6 p-4 rounded-xl text-center border border-yellow-400/50 bg-white/10">
          <div className="flex items-center justify-center gap-2 text-yellow-300">
            <Clock size={20} />
            <span className="font-semibold">Thời gian giữ vé còn lại</span>
          </div>
          <p className="text-4xl font-bold tracking-widest mt-2">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
        </div>

        {/* Booking Summary */}
        <div className="space-y-3 p-6 rounded-xl bg-white/5">
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Tóm tắt đặt vé</h3>
          <div className="flex justify-between"><span>Phim:</span> <span className="font-semibold">{booking.movieId.title}</span></div>
          <div className="flex justify-between"><span>Rạp:</span> <span className="font-semibold">{booking.cinemaId.name}</span></div>
          <div className="flex justify-between">
            <span>Suất chiếu:</span> 
            <span className="font-semibold">
              {booking.time} - {dayjs(booking.date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex justify-between"><span>Ghế:</span> <span className="font-semibold">{booking.seats.join(', ')}</span></div>
          {booking.combos.length > 0 && (
            <div className="flex justify-between"><span>Bắp nước:</span> <span className="font-semibold">{booking.combos.map(c => `${c.quantity}x ${c.comboId?.name || 'Combo'}`).join(', ')}</span></div>
          )}
          <div className="flex justify-between text-xl pt-3 border-t border-white/10">
            <span className="font-bold">Tổng cộng:</span>
            <span className="font-bold text-yellow-400">{booking.totalPrice.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-sm text-slate-300">
            <span>Ngày đặt:</span> 
            <span>{dayjs(booking.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}</span>
          </div>
        </div>

        {/* Payment Error */}
        {paymentError && (
          <div className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
            <div className="flex items-center gap-2 text-red-400"><AlertTriangle size={20} /><span className="font-semibold">Lỗi thanh toán</span></div>
            <p className="mt-2 text-red-300">{paymentError}</p>
          </div>
        )}

        {/* Payment Options */}
        <div className="mt-8 p-6 rounded-xl bg-white/5">
          {paymentInfo ? (
            <div className="text-center">
              <h3 className="mb-4 text-lg font-semibold">Quét mã QR để thanh toán</h3>
              {paymentInfo.qrCodeUrl ? (
                <div className="flex flex-col items-center">
                  <div className="inline-block relative p-1 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl">
                    <div className="bg-white p-3 rounded-lg relative z-10">
                      <QRCode value={paymentInfo.qrCodeUrl} size={220} level="H" includeMargin={true} imageSettings={getQrImageSettings(paymentInfo.method)} />
                    </div>
                  </div>
                  <p className="mt-4 text-slate-300">Sử dụng ứng dụng {getPaymentMethodName(paymentInfo.method)} để quét mã.</p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <a href={paymentInfo.payUrl} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 px-6 py-3 font-semibold text-black rounded-lg hover:bg-yellow-300 transition transform hover:scale-105">Mở ứng dụng {getPaymentMethodName(paymentInfo.method)}</a>
                    <button onClick={() => setPaymentInfo(null)} className="bg-slate-600 px-6 py-3 font-semibold text-white rounded-lg hover:bg-slate-500 transition">Chọn phương thức khác</button>
                  </div>
                </div>
              ) : (
                <div className="text-red-400 text-center"><AlertTriangle className="mx-auto h-12 w-12 mb-2" /><p>Không thể tạo mã QR. Vui lòng thử lại.</p></div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-center">Chọn phương thức thanh toán</h3>
              <div className="space-y-3">
                <button onClick={() => handlePayment('momo')} disabled={isProcessing || timeLeft <= 0} className="w-full py-3 font-semibold rounded-lg flex items-center justify-center bg-[#A50064] text-white disabled:bg-gray-500 disabled:cursor-not-allowed">{isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <img src="/images/momo.png" alt="MoMo" className="h-6 mr-2" />}Thanh toán qua MoMo</button>
                <button onClick={() => handlePayment('vnpay')} disabled={isProcessing || timeLeft <= 0} className="w-full py-3 font-semibold rounded-lg flex items-center justify-center bg-[#0054A6] text-white disabled:bg-gray-500 disabled:cursor-not-allowed">{isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <img src="/images/vnpay.png" alt="VNPay" className="h-6 mr-2" />}Thanh toán qua VNPay</button>
                <button onClick={() => handlePayment('zalopay')} disabled={isProcessing || timeLeft <= 0} className="w-full py-3 font-semibold rounded-lg flex items-center justify-center bg-[#0068FF] text-white disabled:bg-gray-500 disabled:cursor-not-allowed">{isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <img src="/images/zalopay.png" alt="ZaloPay" className="h-6 mr-2" />}Thanh toán qua ZaloPay</button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-4"><button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-white">Hủy và về trang chủ</button></div>
      </div>
    </div>
  );
};

export default PaymentPage;
