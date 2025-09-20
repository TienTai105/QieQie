// JavaScript
import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ShoppingBag, Sparkles } from 'lucide-react';

const giftCards = [
    {
        id: 1,
        name: 'Gift Card 200K',
        desc: 'Phù hợp cho bạn bè hoặc đồng nghiệp, sử dụng cho vé và bắp nước.',
        price: '200.000đ',
        color: 'from-pink-200 to-pink-400',
        icon: <Gift className="w-10 h-10 text-pink-600" />,
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800',
    },
    {
        id: 2,
        name: 'Gift Card 500K',
        desc: 'Lựa chọn phổ biến, mang lại trải nghiệm xem phim trọn vẹn.',
        price: '500.000đ',
        color: 'from-amber-200 to-yellow-400',
        icon: <ShoppingBag className="w-10 h-10 text-yellow-600" />,
        image: 'https://images.unsplash.com/photo-1607082349566-18734288a635?q=80&w=800',
    },
    {
        id: 3,
        name: 'Gift Card 1 Triệu',
        desc: 'Phiên bản VIP, quà tặng cao cấp cho người thân yêu.',
        price: '1.000.000đ',
        color: 'from-purple-200 to-purple-500',
        icon: <Sparkles className="w-10 h-10 text-purple-600" />,
        image: 'https://images.unsplash.com/photo-1581287053822-2be3a20f04ee?q=80&w=800',
    },
];

const GiftCard = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:underline">Trang chủ</Link> <span>/</span>
                <Link to="/services" className="hover:underline">Dịch vụ</Link> <span>/</span>
                <span>Gift Card</span>
            </nav>

            {/* Tiêu đề */}
            <h1 className="text-3xl font-extrabold text-gray-900">Thẻ Quà Tặng (Gift Card)</h1>
            <p className="text-gray-600 mt-2 text-lg">Gửi tặng niềm vui điện ảnh – món quà tinh tế cho mọi dịp đặc biệt.</p>

            {/* Danh sách Gift Card */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {giftCards.map((card) => (
                    <div
                        key={card.id}
                        className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition"
                    >
                        {/* Ảnh minh họa */}
                        <img src={card.image} alt={card.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-90`} />

                        {/* Nội dung */}
                        <div className="relative z-10 p-6 flex flex-col justify-between h-full text-center text-gray-900">
                            <div className="flex flex-col items-center">
                                {card.icon}
                                <h3 className="mt-3 text-2xl font-bold">{card.name}</h3>
                                <p className="mt-1 text-sm text-gray-800">{card.desc}</p>
                                <p className="mt-3 text-lg font-semibold text-black">{card.price}</p>
                            </div>
                            <button className="mt-6 px-5 py-2 rounded-lg bg-yellow-300 text-black font-semibold hover:bg-yellow-200 transition">
                                Mua ngay
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GiftCard;
