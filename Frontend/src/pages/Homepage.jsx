import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Banner from '../components/Banner';
import { useEffect, useState } from 'react';
import MovieSlider from '../components/MovieSlider';
import PromotionSlider from '../components/PromotionSlider';
import { Link } from 'react-router-dom';
import  Contact  from '../components/Contact';

const Homepage = () => {
  const [movies, setMovies] = useState([]);
  const [promotions, setPromotions] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/promotions')
      .then(res => res.json())
      .then(data => setPromotions(data));
  }, []);
  const nowShowing = movies?.filter((m) => m.showing) || [];
  const comingSoon = movies?.filter((m) => m.comingSoon) || [];

  return (
    <>
      <Banner />
      <div className="p-4 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] min-h-screen">
        {movies.length === 0 ? (
          <p className="text-white text-center">Đang tải dữ liệu phim...</p>
        ) : (
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center mt-19">
              PHIM ĐANG CHIẾU
            </h2>
            <MovieSlider movies={nowShowing} />
            <div className="flex justify-center mt-8 mb-16">
              <Link to="/movies/now-showing" className="bg-[#1a1a2e] text-[#f8fafc] font-medium px-12 py-3 border border-yellow-400 hover:bg-yellow-400 hover:text-white transition">
                XEM THÊM
              </Link>
            </div>
            <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center mt-20">
              PHIM SẮP CHIẾU
            </h2>
            <MovieSlider movies={comingSoon} />
            <div className="flex justify-center mt-8 mb-16">
              <Link to="/movies/coming-soon" className="bg-[#1a1a2e] text-[#f8fafc] font-medium px-12 py-3 border border-yellow-400 hover:bg-yellow-400 hover:text-white transition">
                XEM THÊM
              </Link>
            </div>

            <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center mt-20">
              KHUYẾN MÃI
            </h2>
            {promotions.length > 0 ? (
              <div className="mb-20">
                <PromotionSlider promotions={promotions} />
              </div>
            ) : (
              <p className="text-white text-center">Không có khuyến mãi nào</p>
            )}
            <div className="flex justify-center mt-8 mb-16">
              <Link to="/promotion" className="bg-[#1a1a2e] text-[#f8fafc] font-medium px-12 py-3 border border-yellow-400 hover:bg-yellow-400 hover:text-white transition">
                TẤT CẢ KHUYẾN MÃI
              </Link>
            </div>
            <Contact/>
          </div>
        )}
      </div>
    </>
  );
}
export default Homepage;