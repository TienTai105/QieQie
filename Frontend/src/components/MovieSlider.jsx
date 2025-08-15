import React, { useState } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieSlider = ({ movies }) => {
  const [index, setIndex] = useState(0);
  const visible = 4;
  const totalPages = Math.ceil(movies.length / visible);
  const currentPage = Math.floor(index / visible);

  const prev = () => {
    setIndex((prev) => (prev - visible + movies.length) % movies.length);
  };

  const next = () => {
    setIndex((prev) => (prev + visible) % movies.length);
  };

  const goToPage = (page) => {
    setIndex(page * visible);
  };

  const displayedMovies = movies.length > visible
    ? [...movies, ...movies].slice(index, index + visible)
    : movies;

  return (
    <div className="relative w-full">
      <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-yellow-400 transition-colors duration-300">
        <ChevronLeft size={70} />
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-8">
        {displayedMovies.map((movie, i) => (
          <MovieCard key={movie._id + i} movie={movie} />
        ))}
      </div>

      <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-yellow-400 transition-colors duration-300">
        <ChevronRight size={70} />
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`w-3 h-3 rounded-full ${i === currentPage ? 'bg-[#64748b]' : 'bg-[#1a1a2e]'} hover:bg-[#1a1a2e] transition-colors`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default MovieSlider;
