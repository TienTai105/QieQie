import React from 'react';
import { Link } from 'react-router-dom';
import Homepage from '../pages/Homepage';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a2e] font-bold text-[#f8fafc] py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + Mô tả */}
        <div>
          <Link to={"/"}><h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 drop-shadow-md">
            QieQie
          </h3></Link>
          <p className="text-sm mt-2">
            Nền tảng mua vé xem phim tiện lợi, nhanh chóng và dễ sử dụng.
          </p>
        </div>

        {/* Menu liên kết */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Liên kết</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-yellow-400 transition">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/policy" className="hover:text-yellow-400 transition">
                Chính sách
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-yellow-400 transition">
                Hỗ trợ
              </Link>
            </li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Liên hệ</h4>
          <p className="text-sm">Email: tuitennhat294@gmail.com</p>
          <p className="text-sm">Hotline: 0374867241</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} QieQie. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
