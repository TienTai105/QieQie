import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminName = 'Admin'; // Sau này bạn có thể lấy từ context hoặc localStorage

  return (
    <header className="bg-[#16213e] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 bg-[#0f3460] px-4 py-2 rounded-full hover:bg-[#0d2b50] transition-all"
        >
          <span>{adminName}</span>
          <ChevronDown size={18} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
              <User size={18} />
              Thông tin cá nhân
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
