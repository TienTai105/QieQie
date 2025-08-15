import React, { useEffect, useState } from 'react';
import { useLocation ,useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../context/AuthContext'; // sử dụng context để cập nhật user


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // thêm dòng này
  const images = ['/images/vnpay.png', '/images/promo1.jpg', '/images/promo2.jpg', '/images/promo3.jpg'];
  const [current, setCurrent] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  const from = location.state?.from || '/';

  if (!recaptchaToken) {
    alert('Vui lòng xác minh reCAPTCHA trước khi đăng nhập!');
    return;
  }

  if (!emailOrPhone || !password) {
    alert('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Đăng nhập thất bại');
      return;
    }

    localStorage.setItem('token', data.token);
    login(data.token); // lưu vào context

    alert('Đăng nhập thành công!');

    // ➤ Nếu là admin thì chuyển sang /admin
    if (data.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate(from, { replace: true });
    }

  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    alert('Có lỗi xảy ra khi đăng nhập');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4 py-10">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl h-[580px]">
        {/* Left - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex mb-8 border-b border-gray-300">
            <button className="w-1/2 py-2 text-lg font-bold text-white bg-[#1a1a2e] rounded-t-md">ĐĂNG NHẬP</button>
            <button
              className="w-1/2 py-2 text-lg font-bold text-gray-600 bg-gray-100 rounded-t-md hover:bg-gray-200"
              onClick={() => navigate('/register')}
            >
              ĐĂNG KÝ
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium text-gray-700">Email hoặc số điện thoại</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Email hoặc số điện thoại"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <ReCAPTCHA
                sitekey="6Lfi238rAAAAAJ0mh_DcpcaKT3jtVYc3kyU0eyvr"
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a1a2e] text-white py-2 font-bold rounded-md hover:bg-yellow-400 transition-all"
            >
              ĐĂNG NHẬP
            </button>

            <div className="text-center text-sm text-blue-600 hover:underline cursor-pointer mt-2">
              Bạn quên mật khẩu?
            </div>
          </form>
        </div>

        {/* Right - Slideshow */}
        <div className="w-full md:w-1/2 relative h-64 md:h-full">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
