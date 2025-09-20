<<<<<<< HEAD
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Dùng hook

const MovieCard = ({ movie }) => {
  const { user } = useAuth(); // ✅ Dùng hook thay vì context trực tiếp
  const navigate = useNavigate();

  const handleBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: `/movies/${movie._id}` } });
    } else {
      navigate(`/movies/${movie._id}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
=======
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/booking", { state: { movie: movie } });
  };
  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
      
>>>>>>> b32aa75 (update code)
      {/* Hình ảnh */}
      <div className="relative w-full h-[450px] overflow-hidden group cursor-pointer rounded-t-2xl">
        <Link to={`/movies/${movie._id}`} className="block w-full h-full">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
<<<<<<< HEAD
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        </Link>
=======
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        </Link>

        {/* Độ tuổi */}
>>>>>>> b32aa75 (update code)
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
          {movie.ageRestriction?.code || 'Đang cập nhật'}
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Nội dung */}
>>>>>>> b32aa75 (update code)
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="text-[#f8fafc] font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>

        <div className="text-sm text-[#f8fafc] mb-1">
          <span className="font-medium">Thể loại:</span> {movie.genres?.join(', ') || 'Đang cập nhật'}
        </div>

        <div className="text-sm text-[#f8fafc] mb-1">
          <span className="font-medium">Thời lượng:</span> {movie.duration} phút
        </div>

        <div className="text-sm text-[#f8fafc] mb-3">
          <span className="font-medium">Khởi chiếu:</span> {movie.releaseDate || 'Đang cập nhật'}
        </div>

<<<<<<< HEAD
        <div className="mt-auto flex justify-between items-center">
          <a
            href={movie.trailerUrl || '#'}
            className="text-[#f8fafc] text-sm hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem Trailer
          </a>
          <button
            onClick={handleBooking}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm transition"
          >
            Đặt vé
          </button>
=======
        {/* Trailer + Đặt vé */}
        <div className="mt-auto flex justify-between items-center">
          {movie.trailerUrl && (
            <a
              href={movie.trailerUrl}
              className="text-[#f8fafc] text-sm hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem Trailer
            </a>
          )}

          <Link to={`/booking/${movie._id}`}>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded">
              ĐẶT VÉ
            </button>
          </Link>
>>>>>>> b32aa75 (update code)
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
