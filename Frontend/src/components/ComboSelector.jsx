import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ComboSelector = ({ onSelect, selectedCombos }) => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get(`${API_BASE}/api/combos`)
            .then((res) => setCombos(res.data))
            .catch(() => setError("❌ Không tải được danh sách bắp nước"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-white">Đang tải bắp nước...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Grid bắp nước */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {combos.map((item) => {
                    const quantity = selectedCombos[item._id]?.quantity || 0;

                    return (
                        <div
                            key={item._id}
                            className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                                quantity > 0
                                    ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/20'
                                    : 'border-white/10 hover:border-white/20'
                            }`}
                        >
                            {/* Badge số lượng */}
                            {quantity > 0 && (
                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg z-10">
                                    {quantity}
                                </div>
                            )}

                            <div className="flex flex-col items-center text-center h-full">
                                {/* Hình ảnh */}
                                <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src={item.image || ''}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=100&h=100&fit=crop';
                                        }}
                                    />
                                </div>

                                {/* Thông tin sản phẩm */}
                                <div className="flex-1 mb-4">
                                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Giá */}
                                <div className="mb-4">
                                    <p className="text-yellow-400 font-bold text-xl">
                                        {item.price.toLocaleString("vi-VN")} đ
                                    </p>
                                </div>

                                {/* Nút điều khiển */}
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => onSelect(item, -1)}
                                        disabled={quantity === 0}
                                        className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xl font-bold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:from-red-400 hover:to-red-500 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                                    >
                                        −
                                    </button>

                                    <div className="w-16 h-10 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl bg-white/10 rounded-lg px-3 py-1 min-w-[40px] text-center">
                                            {quantity}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => onSelect(item, 1)}
                                        className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold flex items-center justify-center hover:from-green-400 hover:to-green-500 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Thông báo nếu chưa có combo nào */}
            {combos.length === 0 && (
                <div className="text-center p-8">
                    <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-6">
                        <p className="text-gray-400">Không có bắp nước nào để hiển thị</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComboSelector;