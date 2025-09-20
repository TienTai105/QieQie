<<<<<<< HEAD
import React from 'react';
=======
import React, { useEffect, useState } from 'react';
import axios from 'axios';
>>>>>>> b32aa75 (update code)
import {
  Film,
  Users,
  Ticket,
  DollarSign,
} from 'lucide-react';
<<<<<<< HEAD

const DashboardPage = () => {
  const stats = [
    {
      title: 'Phim đang chiếu',
      value: 24,
      icon: <Film size={28} />,
      bg: 'bg-blue-500',
    },
    {
      title: 'Người dùng',
      value: 1052,
      icon: <Users size={28} />,
      bg: 'bg-green-500',
    },
    {
      title: 'Vé đã bán',
      value: 3210,
      icon: <Ticket size={28} />,
      bg: 'bg-yellow-500',
    },
    {
      title: 'Doanh thu',
      value: '152.000.000₫',
      icon: <DollarSign size={28} />,
      bg: 'bg-red-500',
    },
=======
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, movies: 0, bookings: 0, revenue: 0 });
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
        console.warn("⚠️ Chưa có token, không gọi API admin.");
        setLoading(false);
        return;
      }
        const res = await axios.get(`${API_BASE}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);

        // Gọi API doanh thu theo tháng
        const revenueRes = await axios.get(`${API_BASE}/api/admin/monthly-revenue`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMonthlyRevenue(revenueRes.data);
      } catch (err) {
        console.error("Lỗi khi tải thống kê:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Tổng số phim', value: stats.movies, icon: <Film size={28} />, bg: 'bg-blue-500' },
    { title: 'Người dùng', value: stats.users, icon: <Users size={28} />, bg: 'bg-green-500' },
    { title: 'Tổng đơn vé', value: stats.bookings, icon: <Ticket size={28} />, bg: 'bg-yellow-500' },
    { title: 'Doanh thu', value: `${stats.revenue.toLocaleString('vi-VN')}₫`, icon: <DollarSign size={28} />, bg: 'bg-red-500' },
>>>>>>> b32aa75 (update code)
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#1a1a2e]">📊 Tổng quan hệ thống</h2>
<<<<<<< HEAD
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-[#1a1a2e] text-white rounded-xl shadow-md p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-full text-white ${item.bg}`}>
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm text-gray-300">{item.title}</h4>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
=======
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((item, index) => (
              <div
                key={index}
                className="bg-[#1a1a2e] text-white rounded-xl shadow-md p-5 flex items-center gap-4"
              >
                <div className={`p-3 rounded-full text-white ${item.bg}`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm text-gray-300">{item.title}</h4>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Biểu đồ doanh thu */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e]">Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#f59e42" />
              </BarChart>
            </ResponsiveContainer>
            {monthlyRevenue.length === 0 && (
              <p className="text-gray-500 text-center mt-4">Chưa có dữ liệu doanh thu.</p>
            )}
          </div>
        </>
      )}
>>>>>>> b32aa75 (update code)
    </div>
  );
};

<<<<<<< HEAD
export default DashboardPage;
=======
export default DashboardPage;
>>>>>>> b32aa75 (update code)
