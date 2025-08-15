import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShowtimePicker from '../components/ShowtimePicker';
import SeatSelector from '../components/SeatSelector';

const movieData = [
  {
    id: 1,
    title: "Guardians of the Galaxy",
    description: "Một nhóm siêu anh hùng ngoài hành tinh chiến đấu bảo vệ thiên hà khỏi các mối đe dọa.",
    image: "https://image.tmdb.org/t/p/w500/rRcNmiH55Tz0ugUsDUGmj8Bsa4V.jpg",
  },
  {
    id: 2,
    title: "Doctor Strange",
    description: "Một bác sĩ tài giỏi trở thành pháp sư bảo vệ thế giới khỏi các thế lực huyền bí.",
    image: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  },
  {
    id: 3,
    title: "Black Panther",
    description: "T’Challa trở lại Wakanda để kế vị ngai vàng và bảo vệ đất nước khỏi kẻ thù.",
    image: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
  },
];

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showShowtimePicker, setShowShowtimePicker] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const movie = movieData.find((m) => m.id === parseInt(id));

  if (!movie) {
    return <div className="text-center text-red-500 py-10">Không tìm thấy phim!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Phần thông tin phim */}
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={movie.image}
          alt={movie.title}
          className=" h-auto object-cover rounded-lg shadow-md"
          style={{ width: '35%' }}
        />
        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-700 text-lg mb-6">{movie.description}</p>
          <button
            onClick={() => setShowShowtimePicker(!showShowtimePicker)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded text-lg"
          >
            {showShowtimePicker ? 'Ẩn suất chiếu' : 'Chọn suất chiếu'}
          </button>
        </div>
      </div>

      {/* Chọn suất chiếu */}
      {showShowtimePicker && (
        <ShowtimePicker
          onSelect={(showtime) => {
            setSelectedShowtime(showtime);
            setShowShowtimePicker(false);
          }}
        />
      )}

      {/* Hiển thị suất đã chọn */}
      {selectedShowtime && (
        <div className="mt-6 text-green-700 font-semibold text-lg">
          ✅ Suất đã chọn: {selectedShowtime}
        </div>
      )}

      {/* Chọn ghế */}
      {selectedShowtime && (
        <SeatSelector
          onConfirm={(seats) => {
            setSelectedSeats(seats);
            navigate('/checkout', {
              state: {
                movie,
                showtime: selectedShowtime,
                seats,
              },
            });
          }}
        />
      )}
    </div>
  );
};

export default MovieDetail;
