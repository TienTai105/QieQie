import React, { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import { Link } from "react-router-dom";
>>>>>>> b32aa75 (update code)

const PromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    fetch("http://localhost:5000/api/promotions/latest")
      .then((res) => res.json())
      .then((data) => {
        setPromotions(data);
=======
    fetch("http://localhost:5000/api/promotions")
      .then((res) => res.json())
      .then((data) => {
          console.log("API trả về:", data);
      // Nếu là object thì đưa vào array
      setPromotions(Array.isArray(data) ? data : [data]);
>>>>>>> b32aa75 (update code)
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center mt-20 text-lg animate-pulse">
        Đang tải dữ liệu khuyến mãi...
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-red-400 text-center mt-20 text-lg">
        Không tìm thấy khuyến mãi nào.
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="bg-[#0b0b1e] min-h-screen text-white px-6 py-10 font-sans mt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold uppercase text-yellow-400 mb-10 tracking-wide">
=======
    <div className="bg-[#0b0b1e] min-h-screen text-white px-6 py-10 font-sans ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[#f8fafc] font-extrabold uppercase text-3xl mb-10 tracking-wide">
>>>>>>> b32aa75 (update code)
          Chương trình khuyến mãi
        </h1>

        {/* Grid 3 cột, cách nhau gap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promotion) => (
            <div
              key={promotion._id}
              className="bg-[#1a1833] rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              {/* Hình ảnh */}
              {promotion.image && (
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6 flex flex-col flex-grow">
                {/* Tiêu đề */}
                <h2 className="text-yellow-400 font-bold text-xl mb-2 uppercase">
                  {promotion.title}
                </h2>

                {/* Mô tả ngắn */}
                <p className="text-gray-300 text-sm mb-4 flex-grow">
                  {promotion.shortDescription}
                </p>

                {/* Điều kiện */}
                {promotion.conditions?.length > 0 && (
                  <div className="mb-4 bg-[#292651] p-3 rounded text-gray-200 text-sm leading-relaxed">
                    <h3 className="font-semibold mb-1 text-yellow-300 uppercase text-sm">
                      Điều kiện áp dụng
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {promotion.conditions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Lưu ý */}
                {promotion.notes?.length > 0 && (
                  <div className="mb-4 bg-[#292651] p-3 rounded text-gray-200 text-sm leading-relaxed">
                    <h3 className="font-semibold mb-1 text-yellow-300 uppercase text-sm">
                      Lưu ý
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {promotion.notes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nút đặt vé */}
                <div className="text-center mt-auto">
<<<<<<< HEAD
                  <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2 rounded shadow transition">
                    ĐẶT VÉ NGAY
                  </button>
=======
                  <Link 
                  to="/" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2 rounded shadow transition">
                    ĐẶT VÉ NGAY
                  </Link>
>>>>>>> b32aa75 (update code)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionPage;
