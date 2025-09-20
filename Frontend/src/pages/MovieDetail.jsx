<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 👈 thêm useNavigate

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // 👈 tạo navigate

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/movies/${id}`)
      .then(res => res.json())
      .then(setMovie);
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/showtimes?movieId=${id}&date=${date}`)
      .then(res => res.json())
      .then(setShowtimes);
  }, [id, date]);

  const handleBooking = (showtimeId) => {
    navigate(`/booking/${id}?showtimeId=${showtimeId}`);
     // 👈 chuyển sang trang đặt vé và truyền showtimeId
  };

  if (!movie) return <div className="text-white">Đang tải...</div>;

  return (
    <div className="bg-[#0f172a] text-white px-6 py-10 min-h-screen">
      {/* Thông tin phim */}
      <div className="flex flex-col md:flex-row gap-10 mb-12">
        <img src={movie.poster} alt={movie.title} className="w-[300px] rounded-lg" />
        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title} ({movie.ageRestriction?.code})</h1>
          <p><strong>Thể loại:</strong> {movie.genres?.join(', ')}</p>
          <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
          <p><strong>Khởi chiếu:</strong> {movie.releaseDate}</p>
          <p><strong>Đạo diễn:</strong> {movie.director || 'Đang cập nhật'}</p>
          <p className="mt-4">{movie.description || 'Không có mô tả'}</p>

          {movie.trailerUrl && (
            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600"
            >
              Xem Trailer
            </a>
          )}
        </div>
      </div>

      {/* Chọn ngày */}
      <div className="mb-6">
        <label className="mr-4">Chọn ngày:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-black px-3 py-1 rounded"
        />
      </div>

      {/* Lịch chiếu */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Lịch Chiếu</h2>
        {showtimes.length > 0 ? (
  showtimes.map((show, idx) => (
    <div key={idx} className="mb-6 border-b border-gray-600 pb-4">
      <h4 className="font-semibold">{show.cinema}</h4>
      <p>🕒 {show.time}</p>
      <p>Địa chỉ: {show.address}</p>

      {movie && movie._id && (
        <button
          onClick={() => handleBooking(show._id)}
          className="bg-yellow-500 text-black px-4 py-2 rounded mt-2"
        >
          Đặt vé
        </button>
      )}
    </div>
  ))
) : (
  <p>Không có lịch chiếu cho ngày đã chọn.</p>
)}

      </div>
    </div>
>>>>>>> b32aa75 (update code)
  );
};

export default MovieDetail;
