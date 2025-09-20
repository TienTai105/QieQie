import React from 'react';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, useLocation, Router } from 'react-router-dom';

//components
import Header from './components/Header';
import Footer from './components/Footer';
//pages
import MovieDetail from './pages/MovieDetail';
import Success from './pages/Success';
=======
import { Routes, Route } from 'react-router-dom';

// Layout
import UserLayout from './userLayout';
import AdminLayout from './admin/AdminLayout';

// pages
import Homepage from './pages/Homepage';
import MovieDetail from './pages/MovieDetail';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
>>>>>>> b32aa75 (update code)
import Checkout from './pages/Checkout';
import BookingHistory from './pages/BookingHistory';
import PromotionPage from './pages/PromotionPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ComingSoon from './pages/ComingSoon';
import NowShowing from './pages/NowShowing';
<<<<<<< HEAD
import Homepage from './pages/Homepage'; 

import UserLayout from './userLayout';
import PrivateRoute from './components/PrivateRoute';
import adminRoutes from './admin/routes/adminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout người dùng */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/movies/:id"
            element={
              <PrivateRoute>
                <MovieDetail />
              </PrivateRoute>
            }
          />
          <Route path="/success" element={<Success />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/promotion" element={<PromotionPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies/now-showing" element={<NowShowing />} />
          <Route path="/movies/coming-soon" element={<ComingSoon />} />
        </Route>

        {/* Layout admin (đã được bảo vệ bằng PrivateRoute trong adminRoutes) */}
        {adminRoutes}
      </Routes>
    </BrowserRouter>
  );
}
   
export default App;
=======
import BookingPage from './pages/BookingPage';
import PrivateRoute from './routes/PrivateRoute';
import UserDashboard from './pages/UserDashboard';
import Services from './pages/Services';
import Membership from './pages/Membership';
import Theaters from './pages/Theaters';
import Theater3D from './pages/Theater3D';
import SpecialTheater from './pages/SpecialTheater';
import VipTheater from './pages/VipTheater';
import GiftCard from './pages/GiftCard';
import Support from './pages/Support';

function App() {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<Homepage />} />
                <Route
                    path="/movies/:id"
                    element={
                        <PrivateRoute>
                            <MovieDetail />
                        </PrivateRoute>
                    }
                />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment/:bookingId" element={<PaymentPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                    path="/booking/:movieId"
                    element={
                        <PrivateRoute>
                            <BookingPage />
                        </PrivateRoute>
                    } />
                <Route path="/promotion" element={<PromotionPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies/now-showing" element={<NowShowing />} />
                <Route path="/movies/coming-soon" element={<ComingSoon />} />
                <Route path="/movietheater/all-theater" element={<Theaters />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/services" element={<Services />} />
                <Route path="/movietheater/3d-theater" element={<Theater3D />} />
                <Route path="/movietheater/speacial-theater" element={<SpecialTheater />} />
                <Route path="/movietheater/vip" element={<VipTheater />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gift-card" element={<GiftCard />} />
                <Route path="/support" element={<Support />} />

                <Route
                    path="/history"
                    element={
                        <PrivateRoute>
                            <BookingHistory />
                        </PrivateRoute>
                    }
                />
                {/* ✅ Route cho trang Dashboard người dùng */}
                <Route
                    path="/user-dashboard"
                    element={
                        <PrivateRoute>
                            <UserDashboard />
                        </PrivateRoute>
                    } />
            </Route>
            {/* Route cho admin, dùng layout riêng */}
            <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
    );
}

export default App;
>>>>>>> b32aa75 (update code)
