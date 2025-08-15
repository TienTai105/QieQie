import React, { useState } from 'react';
import dayjs from 'dayjs';

const cities = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'];

const cinemaGroups = {
  'Hồ Chí Minh': [
    { name: 'CGV Hùng Vương Plaza', address: '126 Hồng Bàng, Quận 5, TP.HCM' },
    { name: 'CGV Crescent Mall', address: '101 Tôn Dật Tiên, Quận 7' },
    { name: 'CGV Aeon Bình Tân', address: 'Số 1 Đường Số 17A, Bình Tân' },
  ],
  'Hà Nội': [
    { name: 'CGV Vincom Bà Triệu', address: '191 Bà Triệu, Hai Bà Trưng' },
    { name: 'CGV Royal City', address: '72A Nguyễn Trãi, Thanh Xuân' },
  ],
  'Đà Nẵng': [
    { name: 'CGV Đà Nẵng Center', address: '35 Thái Phiên, Hải Châu' },
  ],
  'Cần Thơ': [
    { name: 'CGV Sense City', address: '1 Hòa Bình, Ninh Kiều' },
  ],
};

const dummyMovies = [
  {
    title: 'THÁM TỬ TƯ',
    rating: 'T18',
    poster: 'https://upload.wikimedia.org/wikipedia/en/e/e9/Sherlock_Holmes2Poster.jpg',
    showtimes: ['18:30', '20:50', '22:10'],
    format: '2D Phụ Đề Việt | Rạp GOLD CLASS',
  },
  {
    title: 'SUPERMAN',
    rating: 'T13',
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/85/ManofSteelFinalPoster.jpg',
    showtimes: ['18:40', '21:30'],
    format: '2D Phụ Đề Việt',
  },
];

export default function AllTheater() {
  const [selectedCity, setSelectedCity] = useState('Hồ Chí Minh');
  const [selectedCinema, setSelectedCinema] = useState(cinemaGroups['Hồ Chí Minh'][0].name);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('DD/MM'));

  const days = [...Array(10)].map((_, i) => dayjs().add(i, 'day').format('DD/MM'));

  const cinemaInfo = cinemaGroups[selectedCity].find(c => c.name === selectedCinema);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">CGV CINEMAS</h1>

      {/* Chọn tỉnh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {cities.map(city => (
          <button
            key={city}
            onClick={() => {
              setSelectedCity(city);
              setSelectedCinema(cinemaGroups[city][0].name);
            }}
            className={`px-3 py-2 rounded border text-sm ${
              selectedCity === city ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Cụm rạp */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cinemaGroups[selectedCity].map(cinema => (
          <button
            key={cinema.name}
            onClick={() => setSelectedCinema(cinema.name)}
            className={`px-4 py-2 text-sm rounded border ${
              selectedCinema === cinema.name ? 'bg-red-500 text-white' : 'bg-gray-100'
            }`}
          >
            {cinema.name}
          </button>
        ))}
      </div>

      {/* Thông tin rạp */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">{selectedCinema}</h2>
        <div className="bg-gray-800 text-white p-4 rounded flex flex-col sm:flex-row items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1584291527938-5eae5c6fc79b"
            alt="cinema"
            className="w-64 h-40 object-cover rounded"
          />
          <div className="flex-1">
            <p><strong>Địa chỉ:</strong> {cinemaInfo?.address}</p>
            <p><strong>Hotline:</strong> 1900 6017</p>
            <div className="mt-2 space-x-2">
              <button className="bg-red-500 px-3 py-1 rounded text-white text-sm">Xem bản đồ</button>
              <button className="bg-white px-3 py-1 rounded text-red-500 text-sm border border-red-500">Liên hệ CGV</button>
            </div>
          </div>
        </div>
      </div>

      {/* Chọn ngày */}
      <div className="flex overflow-x-auto gap-2 mb-6">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDate(day)}
            className={`min-w-[60px] px-3 py-1 border rounded text-sm ${
              selectedDate === day ? 'bg-red-500 text-white' : 'bg-gray-100'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Danh sách phim */}
      <div className="space-y-6">
        {dummyMovies.map(movie => (
          <div key={movie.title} className="flex gap-4 items-start border-b pb-4">
            <img src={movie.poster} alt={movie.title} className="w-24 h-36 object-cover rounded" />
            <div>
              <h3 className="text-xl font-bold">{movie.title} <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">{movie.rating}</span></h3>
              <p className="text-sm mt-1">{movie.format}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {movie.showtimes.map(time => (
                  <span key={time} className="bg-gray-200 px-2 py-1 rounded text-sm">{time}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
