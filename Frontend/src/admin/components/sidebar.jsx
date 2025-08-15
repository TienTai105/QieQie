import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Film,
  Tag,
  Calendar,
  Armchair,
  Users,
  MessageCircle,
  Megaphone,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <BarChart2 size={20} /> },
  { name: 'Quản lý Phim', path: '/admin/movies', icon: <Film size={20} /> },
  { name: 'Quản lý Lịch chiếu', path: '/admin/schedules', icon: <Calendar size={20} /> },
  { name: 'Quản lý Phòng chiếu', path: '/admin/rooms', icon: <Armchair size={20} /> },
  { name: 'Quản lý Người dùng', path: '/admin/users', icon: <Users size={20} /> },
  { name: 'Quản lý Bình luận', path: '/admin/comments', icon: <MessageCircle size={20} /> },
  { name: 'Quản lý Khuyến mãi', path: '/admin/promotions', icon: <Megaphone size={20} /> },
  { name: 'Cấu hình hệ thống', path: '/admin/settings', icon: <Settings size={20} /> },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1a1a2e] text-gray-200 flex flex-col">
      <div className="text-2xl font-bold text-center py-6 border-b border-gray-700">
        🎬 QieQie DashBoard
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                isActive ? 'bg-[#0f3460] text-white' : 'hover:bg-gray-700'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
