import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Header from './components/header';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Nội dung từng trang con */}
        <main className="p-6 bg-white flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
