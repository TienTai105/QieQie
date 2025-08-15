// src/layouts/UserLayout.jsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;

