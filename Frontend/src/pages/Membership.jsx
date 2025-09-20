// JavaScript
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Star, Gem } from 'lucide-react';

const levels = [
    {
        name: 'Silver',
        perk: 'Giảm 5% bắp nước',
        color: 'from-gray-200 to-gray-400',
        icon: <Star className="w-10 h-10 text-gray-600" />,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600',
    },
    {
        name: 'Gold',
        perk: 'Giảm 10% vé 2D',
        color: 'from-amber-200 to-amber-400',
        icon: <Crown className="w-10 h-10 text-yellow-500" />,
        image: 'https://images.unsplash.com/photo-1606312619349-3fc62bcec006?q=80&w=600',
    },
    {
        name: 'Platinum',
        perk: 'Ưu tiên suất hot + quà tặng',
        color: 'from-yellow-200 to-yellow-500',
        icon: <Gem className="w-10 h-10 text-yellow-600" />,
        image: 'https://images.unsplash.com/photo-1549921296-3a08870f72d3?q=80&w=600',
    },
];

const Membership = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
            <nav className="text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:underline">Trang chủ</Link> <span>/</span> <span>Thành viên</span>
            </nav>

            <h1 className="text-3xl font-extrabold text-gray-900">Chương trình Thành viên VIP</h1>
            <p className="text-gray-600 mt-2 text-lg">Tham gia ngay để nhận ưu đãi độc quyền và đặc quyền cao cấp.</p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {levels.map((lvl) => (
                    <div
                        key={lvl.name}
                        className="relative group rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform"
                    >
                        {/* Background ảnh */}
                        <img src={lvl.image} alt={lvl.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${lvl.color} opacity-90`} />

                        {/* Nội dung */}
                        <div className="relative z-10 p-6 flex flex-col h-full justify-between text-center text-gray-900">
                            <div className="flex flex-col items-center">
                                {lvl.icon}
                                <h3 className="mt-3 text-2xl font-bold">{lvl.name}</h3>
                                <p className="mt-1 text-sm text-gray-800">{lvl.perk}</p>
                            </div>
                            <button className="mt-6 px-5 py-2 rounded-lg bg-yellow-300 text-black font-semibold hover:bg-yellow-200 transition">
                                Tham gia ngay
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Membership;
