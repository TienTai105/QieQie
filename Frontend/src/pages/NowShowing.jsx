<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import axios from 'axios';

const NowShowing = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
      fetch('http://localhost:5000/api/movies')
        .then(res => res.json())
        .then(data => setMovies(data));
    }, []);
const nowShowing = movies?.filter((m) => m.showing) || [];

  return (
    <div className="bg-[#0f172a] min-h-screen px-4 py-10">
      <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center mt-19 pt-20">
              PHIM ĐANG CHIẾU
            </h2>
      <div className="max-w-7xl mx-auto">
        <MovieList movies={nowShowing} />
=======
import React, { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NowShowing = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/movies");
        console.log("🎬 Dữ liệu trả về từ API:", res.data);

        // ✅ Đảm bảo dữ liệu là mảng
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.items || res.data.movies || [];

        setMovies(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách phim:", err);
        setError("Không thể tải danh sách phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // ✅ Lọc phim đang chiếu, tránh lỗi nếu movies không phải mảng
  const nowShowing = Array.isArray(movies)
    ? movies.filter((m) => Boolean(m.showing))
    : [];

  const handleBooking = (movieId) => {
    navigate(`/booking/${movieId}`);
  };

  if (loading) {
    return (
      <div className="text-center text-white py-20">
        Đang tải danh sách phim...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <div className="bg-[#0f172a] min-h-screen px-4 py-10">
      <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center pt-5">
        PHIM ĐANG CHIẾU
      </h2>
      <div className="max-w-7xl mx-auto">
        {nowShowing.length > 0 ? (
          <MovieList movies={nowShowing} onBooking={handleBooking} />
        ) : (
          <p className="text-center text-gray-400">
            Hiện chưa có phim nào đang chiếu
          </p>
        )}
>>>>>>> b32aa75 (update code)
      </div>
    </div>
  );
};

export default NowShowing;
