// JavaScript
import React from 'react';
import { Link } from 'react-router-dom';
import { Video, MapPin } from 'lucide-react';

const theaters = [
    {
        id: 1,
        name: 'Rạp 3D Galaxy Nguyễn Du',
        address: '116 Nguyễn Du, Q.1, TP.HCM',
        image: 'https://images.unsplash.com/photo-1598899134739-24c46f58e438?q=80&w=800',
    },
    {
        id: 2,
        name: 'CGV Vincom Landmark 81',
        address: '720A Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
        image: 'https://images.unsplash.com/photo-1603190287605-e06f71c6a547?q=80&w=800',
    },
    {
        id: 3,
        name: 'Lotte Cinema Gò Vấp',
        address: '242 Nguyễn Văn Lượng, Gò Vấp, TP.HCM',
        image: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=800',
    },
];

const Theater3D = () => (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:underline">Trang chủ</Link> <span>/</span>
            <Link to="/movietheater/all-theater" className="hover:underline">Rạp phim</Link> <span>/</span>
            <span>Rạp 3D</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-gray-900">Rạp 3D</h1>
        <p className="text-gray-600 mt-2">Danh sách các rạp chiếu phim hỗ trợ công nghệ 3D sống động.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {theaters.map((theater) => (
                <div
                    key={theater.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.02] transition"
                >
                    <img src={theater.image} alt={theater.name} className="h-40 w-full object-cover group-hover:brightness-110 transition" />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Video className="w-5 h-5 text-indigo-500" /> {theater.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-red-500" /> {theater.address}
                        </p>
                        <button className="mt-3 px-4 py-2 rounded-md bg-yellow-300 text-black text-sm font-semibold hover:bg-yellow-200 transition">
                            Xem suất chiếu
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Theater3D;
