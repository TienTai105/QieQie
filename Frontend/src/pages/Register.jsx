<<<<<<< HEAD
=======

>>>>>>> b32aa75 (update code)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
  const images = ['/images/vnpay.png', '/images/1.jpg', '/images/2.jpg', '/images/3.jpg'];
  const [current, setCurrent] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phone: '',
    username: '',
    idNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    // Kiểm tra reCAPTCHA
    if (!recaptchaToken) {
      alert('Vui lòng xác nhận bạn không phải là robot.');
      return;
    }

    // Kiểm tra đồng ý điều khoản
    if (!formData.agreeTerms) {
      alert('Bạn cần đồng ý với điều khoản.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Đăng ký thất bại!');
        return;
      }

      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      alert('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] pt-32">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-[1000px]">
        {/* Form bên trái */}
        <div className="w-1/2 p-8">
          <div className="flex border-b border-gray-300 mb-6">
            <button className="w-1/2 py-2 bg-gray-100 text-gray-700 font-bold" onClick={() => navigate('/login')}>
              ĐĂNG NHẬP
            </button>
            <button className="w-1/2 py-2 bg-[#1a1a2e] text-white font-bold">ĐĂNG KÝ</button>
          </div>

          <form className="space-y-3 text-sm" onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Họ và tên" className="w-full border rounded px-3 py-2" required />
            <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full border rounded px-3 py-2" required />
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Tên đăng nhập" className="w-full border rounded px-3 py-2" required />
            <input name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="CCCD/CMND (tuỳ chọn)" className="w-full border rounded px-3 py-2" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2" required />
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mật khẩu" className="w-full border rounded px-3 py-2" required />
            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Xác nhận mật khẩu" className="w-full border rounded px-3 py-2" required />

            {/* Điều khoản */}
            <div className="mt-2">
              <label className="text-xs">
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mr-2" />
                Tôi đồng ý với <span className="text-blue-700 underline">Điều khoản sử dụng</span>
              </label>
            </div>

            {/* reCAPTCHA */}
            <div className="mt-3">
              <ReCAPTCHA
                sitekey="6Lfi238rAAAAAJ0mh_DcpcaKT3jtVYc3kyU0eyvr"
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>

            <button type="submit" className="w-full bg-[#1a1a2e] text-white py-2 font-bold rounded hover:bg-yellow-400 mt-4">
              ĐĂNG KÝ
            </button>
          </form>
        </div>

        {/* Slide ảnh bên phải */}
        <div className="w-1/2 relative min-h-[600px]">
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
=======
    const navigate = useNavigate();
    const images = ['/images/vnpay.png', '/images/1.jpg', '/images/2.jpg', '/images/3.jpg'];
    const [current, setCurrent] = useState(0);
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        phone: '',
        username: '',
        idNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }

        // Kiểm tra reCAPTCHA
        if (!recaptchaToken) {
            alert('Vui lòng xác nhận bạn không phải là robot.');
            return;
        }

        // Kiểm tra đồng ý điều khoản
        if (!formData.agreeTerms) {
            alert('Bạn cần đồng ý với điều khoản.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'Đăng ký thất bại!');
                return;
            }

            alert('Đăng ký thành công!');
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error);
            alert('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] pt-32">
            <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-[1000px]">
                {/* Form bên trái */}
                <div className="w-1/2 p-8">
                    <div className="flex border-b border-gray-300 mb-6">
                        <button className="w-1/2 py-2 bg-gray-100 text-gray-700 font-bold" onClick={() => navigate('/login')}>
                            ĐĂNG NHẬP
                        </button>
                        <button className="w-1/2 py-2 bg-[#1a1a2e] text-white font-bold">ĐĂNG KÝ</button>
                    </div>

                    <form className="space-y-3 text-sm" onSubmit={handleSubmit}>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Họ và tên" className="w-full border rounded px-3 py-2" required />
                        <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full border rounded px-3 py-2" required />
                        <input name="username" value={formData.username} onChange={handleChange} placeholder="Tên đăng nhập" className="w-full border rounded px-3 py-2" required />
                        <input name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="CCCD/CMND (tuỳ chọn)" className="w-full border rounded px-3 py-2" />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2" required />
                        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mật khẩu" className="w-full border rounded px-3 py-2" required />
                        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Xác nhận mật khẩu" className="w-full border rounded px-3 py-2" required />

                        {/* Điều khoản */}
                        <div className="mt-2">
                            <label className="text-xs">
                                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mr-2" />
                                Tôi đồng ý với <span className="text-blue-700 underline">Điều khoản sử dụng</span>
                            </label>
                        </div>

                        {/* reCAPTCHA */}
                        <div className="mt-3">
                            <ReCAPTCHA
                                sitekey="6Lfi238rAAAAAJ0mh_DcpcaKT3jtVYc3kyU0eyvr"
                                onChange={(token) => setRecaptchaToken(token)}
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#1a1a2e] text-white py-2 font-bold rounded hover:bg-yellow-400 mt-4">
                            ĐĂNG KÝ
                        </button>
                    </form>
                </div>

                {/* Slide ảnh bên phải */}
                <div className="w-1/2 relative min-h-[600px]">
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
>>>>>>> b32aa75 (update code)
};

export default Register;
