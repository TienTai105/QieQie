<<<<<<< HEAD
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

=======
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const UserLayout = () => {
    // Đo chiều cao header thực tế để bù padding-top cho nội dung
    const [headerH, setHeaderH] = useState(0);

    useEffect(() => {
        const el = document.getElementById('site-header');
        const measure = () => el && setHeaderH(el.offsetHeight || 0);
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    return (
        <>
            {/* Header nên có id="site-header" */}
            <Header />

            {/* Bù khoảng trống cho mọi trang theo chiều cao Header */}
            <main style={{ paddingTop: headerH ? `${headerH}px` : undefined }} className={!headerH ? 'pt-20 md:pt-24' : undefined}>
                <Outlet /> {/* Đây là nơi các trang con (Homepage, MovieDetail...) sẽ được render */}
            </main>

            <Footer />
        </>
    );
};

export default UserLayout;
>>>>>>> b32aa75 (update code)
