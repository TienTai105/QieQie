import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-24">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <img src={user.avatar || 'https://via.placeholder.com/100'} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400" />
        <h1 className="text-2xl font-bold mb-2">Xin chào, {user.name}!</h1>
        <p className="text-gray-600 mb-4">Email: {user.email}</p>
        <p className="text-gray-600 mb-6">Vai trò: <span className="font-semibold capitalize">{user.role}</span></p>
        <button onClick={logout} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;