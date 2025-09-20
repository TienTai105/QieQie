<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import MovieSlider from '../components/MovieSlider';
import PromotionSlider from '../components/PromotionSlider';
import { Link } from 'react-router-dom';
import Contact from '../components/Contact';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function normalizeList(payload) {
    // fetch(...).then(res => res.json()) -> payload chính là JSON
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === 'object') {
        // Backend /api/movies trả về { page, limit, total, totalPages, items }
        if (Array.isArray(payload.items)) return payload.items;
        // Trường hợp khác: { results: [...] } hoặc { data: [...] }
        if (Array.isArray(payload.results)) return payload.results;
        if (Array.isArray(payload.data)) return payload.data;
    }
    return [];
}

const Homepage = () => {
    const [movies, setMovies] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingPromos, setLoadingPromos] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoadingMovies(true);
        fetch(`${API_BASE}/api/movies`)
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;
                setMovies(normalizeList(data));
            })
            .catch(() => {
                if (!cancelled) setMovies([]);
            })
            .finally(() => {
                if (!cancelled) setLoadingMovies(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        setLoadingPromos(true);
        fetch(`${API_BASE}/api/promotions`)
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;
                setPromotions(normalizeList(data));
            })
            .catch(() => {
                if (!cancelled) setPromotions([]);
            })
            .finally(() => {
                if (!cancelled) setLoadingPromos(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const movieList = Array.isArray(movies) ? movies : [];
    const nowShowing = movieList.filter((m) => Boolean(m?.showing));
    // Hỗ trợ cả comingSoon (camelCase) và comingsoon (lowercase) để tránh sai khác field
    const comingSoon = movieList.filter((m) => Boolean(m?.comingSoon ?? m?.comingsoon));

    return (
        <>
            <Banner />
            <div className="p-4 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] min-h-screen">
                {loadingMovies ? (
                    <p className="text-white text-center">Đang tải dữ liệu phim...</p>
                ) : movieList.length === 0 ? (
                    <p className="text-white text-center">Không có phim để hiển thị.</p>
                ) : (
                    <div className="max-w-screen-xl mx-auto">
                        <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center mt-19">
                            PHIM ĐANG CHIẾU
                        </h2>
                        <MovieSlider movies={nowShowing} />
                        <div className="flex justify-center mt-8 mb-16">
                            <Link
                                to="/movies/now-showing"
                                className="bg-[#1a1a2e] text-[#f8fafc] font-medium px-12 py-3 border border-yellow-400 hover:bg-yellow-400 hover:text-white transition"
                            >
                                XEM THÊM
                            </Link>
                        </div>

                        <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center mt-20">
                            PHIM SẮP CHIẾU
                        </h2>
                        <MovieSlider movies={comingSoon} />
                        <div className="flex justify-center mt-8 mb-16">
                            <Link
                                to="/movies/coming-soon"
                                className="bg-[#1a1a2e] text-[#f8fafc] font-medium px-12 py-3 border border-yellow-400 hover:bg-yellow-400 hover:text-white transition"
                            >
                                XEM THÊM
                            </Link>
                        </div>

                        <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center mt-20">
                            KHUYẾN MÃI
                        </h2>
                        {loadingPromos ? (
                            <p className="text-white text-center">Đang tải khuyến mãi...</p>
                        ) : promotions.length > 0 ? (
                            <div className="mb-20">
                                <PromotionSlider promotions={promotions} />
                            </div>
                        ) : (
                            <p className="text-white text-center">Không có khuyến mãi nào</p>
                        )}

                        <div className="flex justify-center mt-8 mb-16">
                            <Link
                                to="/promotion"
                                className="bg-[#1a1a2e] text-[#f8fafc] font-medium px-12 py-3 border border-yellow-400 hover:bg-yellow-400 hover:text-white transition"
                            >
                                TẤT CẢ KHUYẾN MÃI
                            </Link>
                        </div>

                        <Contact />
                    </div>
                )}
            </div>
        </>
    );
};

>>>>>>> b32aa75 (update code)
export default Homepage;