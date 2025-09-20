// JavaScript
import React from 'react';
import { Link } from 'react-router-dom';

const vipRooms = [
    {
        id: 1,
        name: 'Phòng VIP Royal',
        desc: 'Không gian sang trọng, ghế đôi cao cấp, dịch vụ riêng.',
        seats: 40,
        image: 'https://images.unsplash.com/photo-1606312619349-3fc62bcec006?q=80&w=800',
    },
    {
        id: 2,
        name: 'Phòng VIP Premium',
        desc: 'Ghế ngả lưng êm ái, phục vụ tận nơi, âm thanh Dolby Atmos.',
        seats: 30,
        image: 'https://images.unsplash.com/photo-1502136969935-8d0710f597e9?q=80&w=800',
    },
];

const VipTheater = () => (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:underline">Trang chủ</Link> <span>/</span>
            <Link to="/movietheater/all-theater" className="hover:underline">Rạp phim</Link> <span>/</span>
            <span>Phòng VIP</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-gray-900">Phòng VIP</h1>
        <p className="text-gray-600 mt-2 text-lg">Trải nghiệm điện ảnh đỉnh cao với không gian và dịch vụ thượng hạng.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {vipRooms.map((room) => (
                <div key={room.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                    {/* Ảnh minh họa */}
                    <div className="relative h-48 md:h-60">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Nội dung */}
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                        <p className="mt-1 text-gray-600">{room.desc}</p>
                        <p className="mt-2 text-sm text-gray-500">Sức chứa: {room.seats} ghế</p>
                        <button className="mt-4 px-5 py-2 rounded-lg bg-yellow-300 text-black font-semibold hover:bg-yellow-200 transition">
                            Đặt chỗ ngay
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default VipTheater;
