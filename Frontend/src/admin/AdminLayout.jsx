import React from 'react';
<<<<<<< HEAD
import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Header from './components/header';
=======
import Sidebar from './components/sidebar';
import Header from './components/header';
import AdminRoutes from './routes/adminRoutes';
>>>>>>> b32aa75 (update code)

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
<<<<<<< HEAD
          <Outlet />
=======
          <AdminRoutes />
>>>>>>> b32aa75 (update code)
        </main>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default AdminLayout;
=======
export default AdminLayout;
>>>>>>> b32aa75 (update code)
