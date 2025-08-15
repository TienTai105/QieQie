import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Router } from 'react-router-dom';

//components
import Header from './components/Header';
import Footer from './components/Footer';
//pages
import MovieDetail from './pages/MovieDetail';
import Success from './pages/Success';
import Checkout from './pages/Checkout';
import BookingHistory from './pages/BookingHistory';
import PromotionPage from './pages/PromotionPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ComingSoon from './pages/ComingSoon';
import NowShowing from './pages/NowShowing';
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
