// JavaScript
import React from 'react';
import { Link } from 'react-router-dom';

const Theaters = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
            <nav className="text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:underline">Trang chủ</Link> <span>/</span> <span>Rạp phim</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hệ thống Rạp phim</h1>
            <p className="text-gray-600 mt-2">Khám phá các rạp gần bạn và trải nghiệm phòng chiếu chất lượng cao.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="h-32 bg-gray-100 rounded mb-3" />
                        <h3 className="text-lg font-semibold">Rạp QieQie #{i}</h3>
                        <p className="text-sm text-gray-600 mt-1">Địa chỉ mẫu, Quận {i}, TP.HCM</p>
                        <button className="mt-3 px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">Xem chi tiết</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Theaters;