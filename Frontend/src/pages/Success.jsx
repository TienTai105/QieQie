<<<<<<< HEAD
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
=======
// JavaScript
import React from 'react';
import { Link } from 'react-router-dom';
import { Popcorn, Users, DoorOpen } from 'lucide-react';

const services = [
    {
        name: 'Bắp nước',
        desc: 'Thưởng thức combo bắp rang và nước uống tươi mát.',
        icon: <Popcorn className="w-10 h-10 text-yellow-600" />,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d4d?q=80&w=800',
    },
    {
        name: 'Combo Gia đình',
        desc: 'Tiết kiệm hơn khi đi cùng cả gia đình.',
        icon: <Users className="w-10 h-10 text-blue-600" />,
        image: 'https://images.unsplash.com/photo-1604881991663-964bdba56c0d?q=80&w=800',
    },
    {
        name: 'Thuê phòng riêng',
        desc: 'Không gian riêng tư để tổ chức sự kiện đặc biệt.',
        icon: <DoorOpen className="w-10 h-10 text-purple-600" />,
        image: 'https://images.unsplash.com/photo-1628277313686-9bfb6baf8eab?q=80&w=800',
    },
];

const Services = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
            <nav className="text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:underline">Trang chủ</Link> <span>/</span> <span>Dịch vụ</span>
            </nav>

            <h1 className="text-3xl font-extrabold text-gray-900">Dịch vụ tại rạp</h1>
            <p className="text-gray-600 mt-2">Trải nghiệm dịch vụ đa dạng, nâng tầm buổi xem phim của bạn.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((s, i) => (
                    <div
                        key={i}
                        className="group relative rounded-xl overflow-hidden shadow hover:shadow-2xl hover:scale-[1.02] transition"
                    >
                        <img src={s.image} alt={s.name} className="h-36 w-full object-cover group-hover:brightness-110 transition" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="relative z-10 p-4 text-white">
                            <div className="flex items-center gap-2">{s.icon}<h3 className="text-lg font-bold">{s.name}</h3></div>
                            <p className="text-sm text-gray-200 mt-1">{s.desc}</p>
                            <button className="mt-3 px-4 py-2 rounded-md bg-yellow-300 text-black text-sm font-semibold hover:bg-yellow-200 transition">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
>>>>>>> b32aa75 (update code)
