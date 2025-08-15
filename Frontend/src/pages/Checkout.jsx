import React from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();

  // ⚠️ Giả lập dữ liệu phim và ghế đã chọn (sẽ cải tiến sau)
  const movie = {
    title: 'Doctor Strange',
    image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    showtime: '20:00 - 10/07/2025',
    seats: ['A1', 'A2', 'B3'],
  };

  // 🧾 Thông tin người dùng
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
  });

  // ✅ Cập nhật form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Có thể kiểm tra dữ liệu hợp lệ ở đây
    console.log('Xác nhận đặt vé:', formData);
    navigate('/success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* 1. Thông tin phim */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img src={movie.image} alt={movie.title} className="w-full md:w-1/3 rounded-lg shadow-md" />
        <div>
          <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
          <p className="text-gray-600 mb-1">Suất chiếu: {movie.showtime}</p>
          <p className="text-gray-600">Ghế đã chọn: {movie.seats.join(', ')}</p>
        </div>
      </div>

      {/* 2. Form thông tin khách hàng */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>

        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        {/* Nút xác nhận */}
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded text-lg"
        >
          Xác nhận & Thanh toán
        </button>
      </form>
    </div>
  );
};

export default Checkout;
