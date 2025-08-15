import React, { useState } from 'react';
import axios from 'axios';

const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/contacts', form);
      setStatus('Gửi liên hệ thành công!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('Gửi liên hệ thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-[#1a083d] text-white py-12 px-4 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-stretch gap-6">
        {/* Social Links */}
{/* Social Links */}
      <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold uppercase text-center">Liên hệ với chúng tôi</h2>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/CinestarHaiBaTrung"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-64 h-16 bg-gradient-to-r from-[#0084ff] to-[#6a1b9a] rounded-md flex items-center justify-center hover:scale-105 transition"
        >
          <img
            src="/images/ct2.jpg"
            alt="Facebook"
            className="absolute left-[-20px] w-16 h-16 object-contain"
          />
          <span className="text-white font-bold text-lg z-10">FACEBOOK</span>
        </a>

        {/* Zalo */}
        <a
          href="https://zalo.me/2861828859391058401"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-64 h-16 bg-gradient-to-r from-[#6a1b9a] to-[#0084ff] rounded-md flex items-center justify-center hover:scale-105 transition"
        >
          <img
            src="/images/ct1.jpg"
            alt="Zalo"
            className="absolute right-[-20px] w-16 h-16 object-contain"
          />
          <span className="text-white font-bold text-lg z-10">ZALO CHAT</span>
        </a>
      </div>

        {/* Form */}
        <div className="w-full md:w-1/2 bg-[#1d3a7c] p-8 rounded-md shadow-lg">
          <h3 className="text-lg font-bold mb-4 uppercase">Thông tin liên hệ</h3>
          <ul className="mb-6 text-sm space-y-2">
            <li>📧 <a href="mailto:cskh@cinestar.com.vn">cskh@cinestar.com.vn</a></li>
            <li>📞 1900 0085</li>
            <li>📍 135 Hai Bà Trưng, phường Sài Gòn, TP.HCM</li>
          </ul>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Họ và tên"
              className="w-full p-2 rounded bg-white text-black"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Điền email"
              className="w-full p-2 rounded bg-white text-black"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Thông tin liên hệ hoặc phản ánh"
              rows="4"
              className="w-full p-2 rounded bg-white text-black"
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-500 transition"
            >
              GỬI NGAY
            </button>
            {status && <p className="text-sm text-center mt-2">{status}</p>}
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactSection;
