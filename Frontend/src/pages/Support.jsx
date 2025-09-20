// JavaScript
import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Mail, Phone } from 'lucide-react';

const Support = () => (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:underline">Trang chủ</Link> <span>/</span> <span>Hỗ trợ</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-gray-900">Trung tâm Hỗ trợ</h1>
        <p className="text-gray-600 mt-2">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FAQ */}
            <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl p-6 shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" /> Câu hỏi thường gặp
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-1">
                    <li>Làm sao đổi/huỷ vé?</li>
                    <li>Không nhận được email vé?</li>
                    <li>Thanh toán thất bại?</li>
                </ul>
            </div>

            {/* Liên hệ */}
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl p-6 shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold">Liên hệ trực tiếp</h3>
                <p className="flex items-center gap-2 text-sm text-gray-700 mt-3">
                    <Mail className="w-4 h-4 text-blue-600" /> support@qieqie.vn
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                    <Phone className="w-4 h-4 text-red-600" /> 1900-0000 (8:00 – 22:00)
                </p>
                <button className="mt-4 px-4 py-2 rounded-md bg-yellow-300 text-black text-sm font-semibold hover:bg-yellow-200 transition">
                    Gửi yêu cầu hỗ trợ
                </button>
            </div>
        </div>
    </div>
);

export default Support;
