<<<<<<< HEAD
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
=======
// JavaScript
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
    UserCircle2, Ticket, History, ChevronDown, MapPin, Clapperboard,
    Gift, HelpCircle, Star, Building2
} from 'lucide-react';

const Header = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    // Quick "Vé của tôi"
    const [miniBookings, setMiniBookings] = useState([]);
    const activeCount = useMemo(() => miniBookings.length, [miniBookings]);

    useEffect(() => {
        const fetchMini = async () => {
            try {
                if (!user) {
                    setMiniBookings([]);
                    return;
                }
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/bookings/history?status=active&limit=3&page=1`, {
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                setMiniBookings(data?.data || []);
            } catch {}
        };
        fetchMini();
    }, [user]);

    const handleMyTicketsClick = (e) => {
        e.preventDefault();
        if (user) navigate('/history');
        else navigate('/login');
    };

    const changeLanguage = (lang) => i18n.changeLanguage(lang);

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <header className="w-full fixed top-0 left-0 z-50">
            {/* Top bar */}
            <div className="bg-slate-900 border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2 text-xs">
                    <div className="flex gap-4">
                        <Link to="/promotion" className="text-slate-300 hover:text-yellow-400 transition">🎫 {t('promotion')}</Link>
                        <a href="/history" onClick={handleMyTicketsClick} className="text-slate-300 hover:text-yellow-400 transition flex items-center gap-1">
                            <History size={14} /> {t('my_tickets')}
                        </a>
                    </div>

                    <div className="flex gap-6 items-center">
                        {/* Vé của tôi (dropdown nhanh) */}
                        <div className="relative group hidden md:block">
                            <button
                                onClick={handleMyTicketsClick}
                                className="relative inline-flex items-center gap-2 text-slate-300 hover:text-yellow-400 transition"
                            >
                                <Ticket size={16} />
                                <span>Vé của tôi</span>
                                {activeCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-yellow-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                                )}
                            </button>
                            {user && (
                                <div className="absolute right-0 mt-2 w-80 bg-slate-800 text-sm text-slate-100 shadow-2xl rounded-lg border border-slate-700
                                opacity-0 group-hover:opacity-100 invisible group-hover:visible
                                transition-all duration-150 z-50 backdrop-blur-sm">
                                    <div className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-200">Vé gần đây</span>
                                            <Link to="/history" className="text-yellow-400 hover:text-yellow-300 hover:underline text-xs">Xem tất cả</Link>
                                        </div>
                                        {miniBookings.length === 0 ? (
                                            <div className="text-slate-400 text-xs py-2">Chưa có vé nào.</div>
                                        ) : (
                                            <ul className="divide-y divide-slate-700">
                                                {miniBookings.map((b) => (
                                                    <li key={b._id} className="py-2 flex gap-3">
                                                        <img src={b?.movieId?.poster} alt={b?.movieId?.title || 'Movie'} className="w-10 h-14 object-cover rounded" />
                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium line-clamp-1 text-slate-200">{b?.movieId?.title}</div>
                                                            <div className="text-xs text-slate-400">{b?.cinemaId?.name}</div>
                                                            <div className="text-xs text-slate-400">
                                                                {(b?.showtimeId?.date || b?.date)} • {(b?.showtimeId?.time || b?.time)}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-slate-700 bg-slate-800/80">
                                        <Link
                                            to="/history"
                                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-300 transition"
                                        >
                                            <History size={16} /> Lịch sử đặt vé
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User menu */}
                        {user ? (
                            <div className="relative group text-slate-300">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-yellow-400 transition">
                                    <UserCircle2 className="w-5 h-5" />
                                    <span className="max-w-[140px] truncate">{user.username}</span>
                                    <ChevronDown size={14} />
                                </div>
                                <div className="absolute right-0 mt-2 w-48 bg-slate-800 text-sm text-slate-200 shadow-2xl rounded-lg border border-slate-700
                                opacity-0 group-hover:opacity-100 invisible group-hover:visible
                                transition-all duration-150 z-50 backdrop-blur-sm overflow-hidden">
                                    <Link to="/user-dashboard" className="block px-4 py-3 hover:bg-slate-700 transition">Thông tin cá nhân</Link>
                                    <Link to="/history" className="block px-4 py-3 hover:bg-slate-700 transition">Lịch sử đặt vé</Link>
                                    <button onClick={logout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition">Đăng xuất</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-slate-300 hover:text-yellow-400 transition flex items-center gap-1">
                                <UserCircle2 className="w-5 h-5" />
                                Đăng nhập
                            </Link>
                        )}

                        {/* Ngôn ngữ */}
                        <div className="flex gap-2 items-center">
                            <button onClick={() => changeLanguage('vi')} className="text-slate-300 hover:text-yellow-400 transition">VN</button>
                            <span className="text-slate-500">|</span>
                            <button onClick={() => changeLanguage('en')} className="text-slate-300 hover:text-yellow-400 transition">EN</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main nav */}
            <div className="bg-slate-800/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 drop-shadow-lg">
                        <Link to="/">QieQie</Link>
                    </div>

                    {/* Menu */}
                    <nav className="flex gap-6 font-medium text-sm text-slate-200">
                        {/* Phim */}
                        <div className="relative group">
              <span className={`cursor-pointer inline-flex items-center gap-1 hover:text-yellow-400 transition ${isActive('/movies') ? 'text-yellow-400' : ''}`}>
                <Clapperboard size={16} /> {t('nav.movies')} <ChevronDown size={14} />
              </span>
                            <div className="absolute left-0 mt-2 w-56 bg-slate-800 shadow-2xl border border-slate-700 rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-150 z-50 backdrop-blur-sm overflow-hidden">
                                <Link to="/movies/now-showing" className="block px-4 py-3 hover:bg-slate-700 text-slate-200 transition">🎬 Phim đang chiếu</Link>
                                <Link to="/movies/coming-soon" className="block px-4 py-3 hover:bg-slate-700 text-slate-200 transition">📅 Phim sắp chiếu</Link>
                            </div>
                        </div>

                        {/* Rạp phim */}
                        <div className="relative group">
              <span className={`cursor-pointer inline-flex items-center gap-1 hover:text-yellow-400 transition ${isActive('/movietheater') ? 'text-yellow-400' : ''}`}>
                <Building2 size={16} /> {t('nav.movietheater')} <ChevronDown size={14} />
              </span>
                            <div className="absolute left-0 mt-2 w-[480px] bg-slate-800 shadow-2xl border border-slate-700 rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-150 z-50 p-4 grid grid-cols-2 gap-3 backdrop-blur-sm">
                                <Link to="/movietheater/all-theater" className="px-3 py-3 rounded-md hover:bg-slate-700 flex items-center gap-2 text-slate-200 transition">
                                    <MapPin size={16} /> Tất cả các rạp
                                </Link>
                                <Link to="/movietheater/speacial-theater" className="px-3 py-3 rounded-md hover:bg-slate-700 flex items-center gap-2 text-slate-200 transition">
                                    <Star size={16} /> Rạp đặc biệt
                                </Link>
                                <Link to="/movietheater/3d-theater" className="px-3 py-3 rounded-md hover:bg-slate-700 flex items-center gap-2 text-slate-200 transition">
                                    <Clapperboard size={16} /> Rạp 3D
                                </Link>
                                <Link to="/movietheater/vip" className="px-3 py-3 rounded-md hover:bg-slate-700 flex items-center gap-2 text-slate-200 transition">
                                    <Star size={16} /> Phòng VIP
                                </Link>
                            </div>
                        </div>

                        {/* Thành viên */}
                        <div className="relative group">
              <span className={`cursor-pointer inline-flex items-center gap-1 hover:text-yellow-400 transition ${isActive('/membership') || isActive('/user-dashboard') ? 'text-yellow-400' : ''}`}>
                {t('nav.members')} <ChevronDown size={14} />
              </span>
                            <div className="absolute left-0 mt-2 w-56 bg-slate-800 shadow-2xl border border-slate-700 rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-150 z-50 backdrop-blur-sm overflow-hidden">
                                <Link to="/membership" className="block px-4 py-3 hover:bg-slate-700 text-slate-200 transition">Hạng thành viên</Link>
                                <Link to="/user-dashboard" className="block px-4 py-3 hover:bg-slate-700 text-slate-200 transition">Thông tin tài khoản</Link>
                                <Link to="/history" className="block px-4 py-3 hover:bg-slate-700 text-slate-200 transition">Lịch sử & Vé của tôi</Link>
                            </div>
                        </div>

                        {/* Dịch vụ */}
                        <div className="relative group">
              <span className={`cursor-pointer inline-flex items-center gap-1 hover:text-yellow-400 transition ${isActive('/services') ? 'text-yellow-400' : ''}`}>
                {t('nav.services')} <ChevronDown size={14} />
              </span>
                            <div className="absolute left-0 mt-2 w-56 bg-slate-800 shadow-2xl border border-slate-700 rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-150 z-50 backdrop-blur-sm overflow-hidden">
                                <Link to="/services" className="block px-4 py-3 hover:bg-slate-700 text-slate-200 transition">Dịch vụ tại rạp</Link>
                                <Link to="/gift-card" className="block px-4 py-3 hover:bg-slate-700 text-slate-200 transition flex items-center gap-2"><Gift size={16}/> Gift Card</Link>
                                <Link to="/support" className="block px-4 py-3 hover:bg-slate-700 text-slate-200 transition flex items-center gap-2"><HelpCircle size={16}/> Hỗ trợ</Link>
                            </div>
                        </div>

                        {/* Lịch sử (shortcut) */}
                        <Link to="/history" className={`hidden md:inline-flex items-center gap-1 hover:text-yellow-400 transition ${isActive('/history') ? 'text-yellow-400' : ''}`}>
                            <History size={16}/> {t('nav.history')}
                        </Link>
                    </nav>

                    {/* CTA */}
                    <div className="hidden sm:block">
                        <Link
                            to="/checkout"
                            className="bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-lg shadow-lg hover:bg-yellow-300 transition text-sm font-bold hover:shadow-xl transform hover:scale-105"
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
>>>>>>> b32aa75 (update code)
