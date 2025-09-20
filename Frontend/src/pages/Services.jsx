// JavaScript
import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
            <nav className="text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:underline">Trang chủ</Link> <span>/</span> <span>Dịch vụ</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dịch vụ tại rạp</h1>
            <p className="text-gray-600 mt-2">Đa dạng dịch vụ: bắp nước, combo gia đình, đặt phòng chiếu riêng,...</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Bắp nước', 'Combo Gia đình', 'Thuê phòng riêng'].map((name, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <div className="h-28 bg-gray-100 rounded mb-3" />
                        <h3 className="text-lg font-semibold">{name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Mô tả ngắn dịch vụ {name.toLowerCase()}.</p>
                        <button className="mt-3 px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">Tìm hiểu thêm</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;