import React, { useState } from 'react';

const cities = ['TP. Hồ Chí Minh', 'Hà Nội', 'Khánh Hòa'];

const dates = [...Array(14)].map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    day: date.getDate(),
    weekday: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
    full: date.toLocaleDateString('vi-VN'),
  };
});

const formats = [
  '2D Phụ Đề Việt',
  '2D Lồng Tiếng Việt',
  '4DX 2D',
  'SCREENX 2D',
  'ULTRA 4DX',
];

const allShowtimes = {
  'TP. Hồ Chí Minh': [
    {
      cinema: 'CGV Hùng Vương Plaza',
      rooms: [
        { type: '2D', times: ['10:10', '14:00', '18:40'] },
        { type: 'GOLDCLASS', times: ['20:00'] },
      ],
    },
    {
      cinema: 'CGV Crescent Mall',
      rooms: [
        { type: '2D', times: ['09:40', '13:25', '22:00'] },
      ],
    },
  ],
  'Hà Nội': [
    {
      cinema: 'CGV Times City',
      rooms: [
        { type: '2D', times: ['11:00', '16:00', '21:00'] },
      ],
    },
  ],
  'Khánh Hòa': [
    {
      cinema: 'CGV Nha Trang Center',
      rooms: [
        { type: '2D', times: ['08:30', '12:00', '19:00'] },
      ],
    },
  ],
};

export default function ShowtimeSelector({ movieTitle }) {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [selectedDate, setSelectedDate] = useState(dates[0].full);
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);

  const showtimes = allShowtimes[selectedCity] || [];

  return (
    <div className="bg-[#fffaf0] p-4 rounded-xl shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">{movieTitle}</h2>

      {/* Thành phố */}
      <div className="mb-4 flex justify-center">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border px-4 py-2 rounded-md text-base"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              📍 {city}
            </option>
          ))}
        </select>
      </div>

      {/* Ngày */}
      <div className="flex overflow-x-auto space-x-3 mb-4">
        {dates.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDate(d.full)}
            className={`px-3 py-2 rounded-md border whitespace-nowrap ${
              selectedDate === d.full ? 'bg-red-600 text-white' : 'bg-white'
            }`}
          >
            <div className="text-sm">{d.weekday}</div>
            <div className="font-bold">{d.day}</div>
          </button>
        ))}
      </div>

      {/* Định dạng */}
      <div className="flex flex-wrap gap-2 mb-6">
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => setSelectedFormat(format)}
            className={`px-4 py-2 rounded border ${
              selectedFormat === format ? 'bg-red-600 text-white' : 'bg-white'
            }`}
          >
            {format}
          </button>
        ))}
      </div>

      {/* Suất chiếu */}
      <div className="space-y-6">
        {showtimes.map((cinema, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-lg border-b pb-1">{cinema.cinema}</h3>
            {cinema.rooms.map((room, rIdx) => (
              <div key={rIdx} className="mt-2">
                <p className="text-sm font-medium">Rạp {room.type}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {room.times.map((time, tIdx) => (
                    <button
                      key={tIdx}
                      className="px-3 py-1 border rounded-md hover:bg-red-100"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
