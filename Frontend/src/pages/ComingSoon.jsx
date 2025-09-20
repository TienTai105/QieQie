<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import axios from 'axios';

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);
useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);
  const comingSoon = movies?.filter((m) => m.comingSoon) || [];

  return (
    <div className="bg-[#0f172a] min-h-screen px-4 py-10">
      <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center mt-19 pt-20">
              PHIM SẮP CHIẾU
            </h2>
      <div className="max-w-7xl mx-auto">
        <MovieList movies={comingSoon} />
=======
import React, { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import axios from "axios";

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // ✅ Lọc phim sắp chiếu an toàn
  const comingSoon = Array.isArray(movies)
    ? movies.filter((m) => Boolean(m.comingSoon)) // 🔑 dùng đúng key "comingsoon"
    : [];

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
      <h2 className="text-[#f8fafc] text-3xl font-bold mb-10 text-center pt-2">
        PHIM SẮP CHIẾU
      </h2>
      <div className="max-w-7xl mx-auto">
        {comingSoon.length > 0 ? (
          <MovieList movies={comingSoon} />
        ) : (
          <p className="text-center text-gray-400">
            Hiện chưa có phim nào sắp chiếu
          </p>
        )}
>>>>>>> b32aa75 (update code)
      </div>
    </div>
  );
};

export default ComingSoon;
