import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dataFromState = location.state;
  const dataFromStorage = localStorage.getItem('lastBooking');

  const booking = dataFromState || (dataFromStorage && JSON.parse(dataFromStorage));

  // Nếu có dữ liệu từ state => lưu vào localStorage
  useEffect(() => {
    if (dataFromState) {
      localStorage.setItem('lastBooking', JSON.stringify(dataFromState));
    }

    if (!booking) {
      navigate('/');
    }
  }, [dataFromState, booking, navigate]);

  if (!booking) return null;

  const { movie, showtime, seats, customer } = booking;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        🎉 Đặt vé thành công!
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md text-left space-y-2">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Thông tin vé</h2>
        <p><strong>🎬 Phim:</strong> {movie?.title}</p>
        <p><strong>🕒 Suất chiếu:</strong> {showtime}</p>
        <p><strong>💺 Ghế:</strong> {seats?.join(', ')}</p>

        <hr className="my-4" />

        <h2 className="text-xl font-semibold mb-3 text-gray-800">Thông tin khách hàng</h2>
        <p><strong>👤 Họ tên:</strong> {customer?.name}</p>
        <p><strong>📧 Email:</strong> {customer?.email}</p>
        <p><strong>📱 Số điện thoại:</strong> {customer?.phone}</p>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('lastBooking');
          navigate('/');
        }}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded text-lg transition"
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default Success;
