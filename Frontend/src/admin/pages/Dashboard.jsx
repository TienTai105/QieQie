import React from 'react';
import {
  Film,
  Users,
  Ticket,
  DollarSign,
} from 'lucide-react';

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
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#1a1a2e]">📊 Tổng quan hệ thống</h2>
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
    </div>
  );
};

export default DashboardPage;
