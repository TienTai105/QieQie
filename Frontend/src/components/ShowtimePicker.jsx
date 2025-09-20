<<<<<<< HEAD
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
=======
// JavaScript
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

// Component để chọn ngày và suất chiếu cho một bộ phim cụ thể.
export default function ShowtimePicker({ movieId, onSelect }) {
    // --- State Management ---
    // State lưu trữ danh sách suất chiếu lấy từ API.
    const [showtimes, setShowtimes] = useState([]);
    // State lưu trữ ngày đang được chọn bởi người dùng.
    const [selectedDate, setSelectedDate] = useState('');
    // State quản lý trạng thái tải dữ liệu (loading).
    const [isLoading, setIsLoading] = useState(true);
    // State lưu trữ lỗi nếu có khi gọi API.
    const [error, setError] = useState(null);

    // --- Data Fetching Effect ---
    // useEffect sẽ chạy mỗi khi `movieId` thay đổi để lấy dữ liệu suất chiếu mới.
    useEffect(() => {
        // Bỏ qua nếu không có movieId.
        if (!movieId) {
            setIsLoading(false);
            return;
        }

        // Reset trạng thái trước khi gọi API mới.
        setIsLoading(true);
        setError(null);
        setShowtimes([]);
        setSelectedDate('');

        // Sử dụng AbortController để có thể hủy request nếu component bị unmount.
        const controller = new AbortController();

        const fetchShowtimes = async () => {
            try {
                // Gửi request đến API để lấy lịch chiếu theo movieId.
                const res = await axios.get('http://localhost:5000/api/showtime', {
                    params: { movieId },
                    signal: controller.signal,
                });

                // DEBUG: In ra toàn bộ response để kiểm tra cấu trúc dữ liệu.
                console.log('API Response:', res);

                // Xử lý dữ liệu trả về. API có thể trả về một mảng trực tiếp,
                // hoặc một object có chứa mảng trong thuộc tính 'items'.
                const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.items) ? res.data.items : [];

                // DEBUG: In ra dữ liệu sau khi đã xử lý.
                console.log('Processed Data:', data);

                setShowtimes(data);

                // Tự động chọn ngày đầu tiên trong danh sách làm ngày mặc định.
                if (data.length > 0) {
                    const uniqueDates = Array.from(new Set(data.map((s) => s.date))).sort();
                    setSelectedDate(uniqueDates[0] || '');
                }
            } catch (err) {
                // Bắt lỗi, bao gồm cả lỗi do AbortController.
                if (axios.isCancel(err)) {
                    console.log('Request canceled:', err.message);
                } else {
                    console.error('❌ Lỗi lấy lịch chiếu:', err);
                    setError('Không thể tải được lịch chiếu. Vui lòng thử lại sau.');
                }
            } finally {
                // Dù thành công hay thất bại, kết thúc trạng thái loading.
                setIsLoading(false);
            }
        };

        fetchShowtimes();

        // Cleanup function: Hủy request nếu component unmount trước khi request hoàn thành.
        return () => {
            controller.abort();
        };
    }, [movieId]); // Phụ thuộc vào movieId.

    // --- Memoized Derived State ---
    // useMemo để tính toán danh sách các ngày duy nhất, tránh tính toán lại không cần thiết.
    const dates = useMemo(() => {
        const uniqueDates = Array.from(new Set(showtimes.map((s) => s.date))).sort();
        return uniqueDates.map((d) => {
            const dt = new Date(d);
            // Chuyển đổi ngày thành định dạng dễ đọc hơn cho UI.
            return {
                full: d, // Ngày đầy đủ (YYYY-MM-DD)
                day: dt.getDate(), // Ngày trong tháng
                weekday: dt.toLocaleDateString('vi-VN', { weekday: 'short' }), // Thứ trong tuần
            };
        });
    }, [showtimes]);

    // useMemo để lọc danh sách suất chiếu theo ngày đã chọn.
    const filteredByDate = useMemo(() => showtimes.filter((s) => s.date === selectedDate), [showtimes, selectedDate]);

    // --- Render Logic ---
    if (isLoading) {
        return <div className="text-center p-6">Đang tải lịch chiếu...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-500">{error}</div>;
    }

    if (showtimes.length === 0) {
        return (
            <div className="bg-[#fffaf0] p-4 rounded-xl shadow mt-6">
                <h2 className="text-xl font-bold mb-4 text-center text-red-600">Chọn suất chiếu</h2>
                <span className="text-gray-600 text-center block">Hiện chưa có lịch chiếu cho phim này.</span>
            </div>
        );
    }

    return (
        <div className="bg-[#fffaf0] p-4 rounded-xl shadow mt-6">
            <h2 className="text-xl font-bold mb-4 text-center text-red-600">Chọn suất chiếu</h2>

            {/* Phần chọn ngày */}
            <div className="flex overflow-x-auto space-x-3 mb-4 pb-2">
                {dates.map((d) => (
                    <button
                        key={d.full}
                        onClick={() => setSelectedDate(d.full)}
                        className={`flex-shrink-0 px-3 py-2 rounded-md border whitespace-nowrap transition-colors duration-200 ${
                            selectedDate === d.full ? 'bg-red-600 text-white border-red-600' : 'bg-white hover:bg-red-50'
                        }`}
                        title={d.full}
                    >
                        <div className="text-sm">{d.weekday}</div>
                        <div className="font-bold text-lg">{String(d.day).padStart(2, '0')}</div>
                    </button>
                ))}
            </div>

            {/* Phần hiển thị các suất chiếu theo rạp */}
            <div className="space-y-6">
                {filteredByDate.length === 0 ? (
                    <p className="text-gray-600 text-center">Vui lòng chọn ngày để xem suất chiếu.</p>
                ) : (
                    filteredByDate.map((show) => {
                        // Xử lý linh hoạt trường hợp `cinemas` là object (đã populate) hoặc chỉ là ID.
                        const cinemaId = show.cinemas?._id || show.cinemas;
                        const cinemaName = show.cinemas?.name || show.cinemaName || 'Rạp không xác định';
                        return (
                            <div key={show._id}>
                                <h3 className="font-bold text-lg border-b pb-1 mb-2">🎬 {cinemaName}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {/* Sắp xếp các giờ chiếu trước khi hiển thị */}
                                    {(show.times || []).sort().map((time) => (
                                        <button
                                            // Sử dụng `time` làm key vì nó là duy nhất trong mảng `times`.
                                            key={time}
                                            onClick={() => onSelect({ ...show, time, cinemaId })}
                                            className="px-4 py-2 border rounded-md bg-white hover:bg-red-100 hover:border-red-300 transition-colors duration-200"
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
>>>>>>> b32aa75 (update code)
