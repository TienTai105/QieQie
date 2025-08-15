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
      </div>
    </div>
  );
};

export default ComingSoon;
