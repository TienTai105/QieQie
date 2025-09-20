import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ComboList = ({ onSelect }) => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/combos`);
                setCombos(res.data);
            } catch (err) {
                console.error("❌ Lỗi tải combos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCombos();
    }, []);

    if (loading) {
        return <p className="text-white">Đang tải combo...</p>;
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">🍿 Chọn bắp nước</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {combos.map((combo) => (
                        <div
                        key={combo._id}
                        className="bg-white/10 rounded-lg p-4 text-center hover:scale-105 transition"
                        >
                            <img
                                src={combo.image || ''}
                                alt={combo.name}
                                className="w-28 h-28 mx-auto object-cover rounded-lg"
                            />
                            <h3 className="text-white font-semibold mt-2">{combo.name}</h3>
                            <p className="text-gray-300 text-sm">{combo.description}</p>
                            <p className="text-yellow-400 font-bold mt-1">
                                {combo.price.toLocaleString("vi-VN")} đ
                            </p>
                            <button
                                onClick={() => onSelect(combo)}
                                className="mt-2 w-full bg-yellow-400 text-black py-1 rounded-lg font-semibold hover:bg-yellow-300"
                            >
                                + Thêm
                            </button>
                        </div>
                ))}
            </div>
        </div>
    );
};

export default ComboList;
