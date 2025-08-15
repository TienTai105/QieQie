// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading ban đầu là true

  // ✅ Hàm login: lưu token + decode
  const login = (token) => {
    try {
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        role: decoded.role,
        username: decoded.username,
      });
      setLoading(false); // nếu bạn cần set ở đây sau login
    } catch (error) {
      console.error('Lỗi khi decode token:', error);
    }
  };

  // ✅ Hàm logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false); // đảm bảo trạng thái loading không bị kẹt
  };

  // ✅ Load user từ token khi reload trang
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn('Token đã hết hạn');
          logout();
        } else {
          setUser({
            id: decoded.id,
            role: decoded.role,
            username: decoded.username,
          });
        }
      } catch (error) {
        console.error('Token không hợp lệ:', error);
        logout();
      }
    }

    // ✅ Dù có token hay không, luôn set loading = false sau xử lý
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook sử dụng context
export const useAuth = () => useContext(AuthContext);
