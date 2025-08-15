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
      </div>
    </div>
  );
};

export default NowShowing;
