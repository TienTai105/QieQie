// JavaScript
import React from "react";
import { Link } from "react-router-dom";
import { Star, Crown, Tv } from "lucide-react";

const specials = [
    {
        name: "Rạp IMAX",
        desc: "Màn hình siêu lớn, âm thanh vòm đỉnh cao, trải nghiệm điện ảnh chân thực.",
        icon: <Tv className="w-8 h-8 text-blue-500" />,
        image:
            "https://images.unsplash.com/photo-1581320541030-7a38aef6eaa4?q=80&w=1000",
    },
    {
        name: "Rạp Gold Class",
        desc: "Ghế ngồi cao cấp, phục vụ tận nơi – nơi tận hưởng sự sang trọng.",
        icon: <Crown className="w-8 h-8 text-yellow-400" />,
        image:
            "https://images.unsplash.com/photo-1603190287605-e06f71c6a547?q=80&w=1000",
    },
    {
        name: "Rạp 4DX",
        desc: "Hiệu ứng rung lắc, gió, mùi hương mang đến cảm giác nhập vai cực mạnh.",
        icon: <Star className="w-8 h-8 text-purple-500" />,
        image:
            "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1000",
    },
];

const SpecialTheater = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
            <nav className="text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:underline">
                    Trang chủ
                </Link>{" "}
                <span>/</span>{" "}
                <Link to="/movietheater/all-theater" className="hover:underline">
                    Rạp phim
                </Link>{" "}
                <span>/</span> <span>Rạp đặc biệt</span>
            </nav>

            <h1 className="text-3xl font-extrabold text-gray-900">Rạp đặc biệt</h1>
            <p className="text-gray-600 mt-2">
                Danh sách các rạp chiếu phim cao cấp, mang lại trải nghiệm điện ảnh độc
                đáo.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {specials.map((s, i) => (
                    <div
                        key={i}
                        className="group relative rounded-xl overflow-hidden shadow hover:shadow-2xl hover:scale-[1.02] transition"
                    >
                        <img
                            src={s.image}
                            alt={s.name}
                            className="h-40 w-full object-cover group-hover:brightness-110 transition"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="relative z-10 p-4 text-white">
                            <div className="flex items-center gap-2">
                                {s.icon}
                                <h3 className="text-lg font-bold">{s.name}</h3>
                            </div>
                            <p className="text-sm text-gray-200 mt-1">{s.desc}</p>
                            <button className="mt-3 px-4 py-2 rounded-md bg-yellow-300 text-black text-sm font-semibold hover:bg-yellow-200 transition">
                                Xem suất chiếu
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecialTheater;
