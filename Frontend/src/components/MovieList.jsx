<<<<<<< HEAD


import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ title, movies }) => {
  return (
    <div className="mb-12">
      <h2 className="text-white text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
=======
import React from 'react';
import MovieCard from './MovieCard';
const MovieList = ({ title, movies, onBooking }) => {
  return (
    <div className="mb-12 px-4">
      {title && <h2 className="text-white text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <MovieCard
            key={movie._id || movie.id}
            movie={movie}
            onBooking={onBooking} // 👈 Truyền xuống
          />
>>>>>>> b32aa75 (update code)
        ))}
      </div>
    </div>
  );
};

export default MovieList;
<<<<<<< HEAD



=======
>>>>>>> b32aa75 (update code)
