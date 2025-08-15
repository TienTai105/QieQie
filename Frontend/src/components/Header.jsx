import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { UserCircle2, LogOut } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log('User trong Header:', user); // 👈 Thêm dòng này

  const handleMyTicketsClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/history');
    } else {
      navigate('/login');
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 shadow-md">
      {/* Top bar */}
      <div className="bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2 text-xs text-gray-700">
          <div className="flex gap-4">
            <Link to="/promotion" className="text-[#f8fafc] hover:text-yellow-400 transition">🎫 {t('promotion')}</Link>
            <a href="/history" onClick={handleMyTicketsClick} className="text-[#f8fafc] hover:text-yellow-400 transition">🧾 {t('my_tickets')}</a>
          </div>
          <div className="flex gap-6 items-center">
           {user ? (
  <div className="relative group text-white">
    {/* Hiển thị icon + tên */}
    <div className="flex items-center gap-1 cursor-pointer hover:text-yellow-400">
      <UserCircle2 className="w-5 h-5" />
      <span>{user.username}</span>
    </div>

    {/* Dropdown khi hover */}
    <div className="absolute right-0 mt-2 w-44 bg-white text-sm text-gray-800 shadow-md rounded-md 
                    opacity-0 group-hover:opacity-100 invisible group-hover:visible 
                    transition-all duration-200 z-50">
      {/* Dòng Thông tin cá nhân */}
      <Link
        to="/profile"
        className="block px-4 py-2 hover:bg-gray-100"
      >
        Thông tin cá nhân
      </Link>

      {/* Dòng Đăng xuất */}
      <button
        onClick={logout}
        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-800"
      >
        Đăng xuất
      </button>
    </div>
  </div>
) : (
  <Link
    to="/login"
    className="text-white hover:text-yellow-400 transition flex items-center gap-1"
  >
    <UserCircle2 className="w-5 h-5" />
    Đăng nhập
  </Link>
)}
            <div className="flex gap-2 items-center">
              <button onClick={() => changeLanguage('vi')} className="text-[#f8fafc] hover:text-yellow-400">VN</button>
              <span className="text-[#f8fafc]">|</span>
              <button onClick={() => changeLanguage('en')} className="text-[#f8fafc] hover:text-yellow-400">EN</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 drop-shadow-md">
            <Link to="/">QieQie</Link>
          </div>

          {/* Menu */}
          <nav className="flex gap-8 font-semibold text-sm text-gray-900 relative">
            {/* Dropdown group */}
            <div className="relative group">
              <span className="cursor-pointer text-[#f8fafc] hover:text-yellow-400">{t('nav.movies')}</span>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/movies/now-showing"
                  className="block px-4 py-2 hover:bg-yellow-200 text-sm"
                >
                  🎬 Phim đang chiếu
                </Link>
                <Link
                  to="/movies/coming-soon"
                  className="block px-4 py-2 hover:bg-yellow-200 text-sm"
                >
                  📅 Phim sắp chiếu
                </Link>
              </div>
            </div>
            <div className="relative group">
              <span className="cursor-pointer text-[#f8fafc] hover:text-yellow-400">{t('nav.movietheater')}</span>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/movietheater/all-theater"
                  className="block px-4 py-2 hover:bg-yellow-100 text-sm"
                >
                  Tất cả các rạp
                </Link>
                <Link
                  to="/movietheater/speacial-theater"
                  className="block px-4 py-2 hover:bg-yellow-100 text-sm"
                >
                  Rạp đặc biệt
                </Link>
                <Link
                  to="/movietheater/3d-theater"
                  className="block px-4 py-2 hover:bg-yellow-100 text-sm"
                >
                  Rạp 3D
                </Link>

              </div>

            </div>

            <Link to="/theaters" className="text-[#f8fafc] hover:text-yellow-400">{t('nav.members')}</Link>
            <Link to="/membership" className="text-[#f8fafc] hover:text-yellow-400">{t('nav.services')}</Link>
            <Link to="/services" className="text-[#f8fafc] hover:text-yellow-400">{t('nav.history')}</Link>
          </nav>

          {/* Button */}
          <div>
            <Link
              to="/checkout"
              className="bg-grey-600 text-[#f8fafc] text-white px-4 py-2 rounded-sm shadow hover:bg-yellow-400 hover:text-white transition text-sm font-semibold"
            >
              🎟 {t('buy_now')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
