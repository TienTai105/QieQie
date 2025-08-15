import React, { useEffect, useState } from 'react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('bookings');
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, []);

  if (bookings.length === 0) {
    return <div className="p-10 text-center text-gray-600">Chưa có đặt vé nào.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đặt vé</h2>

      <div className="space-y-6">
        {bookings.map((b, index) => (
          <div key={index} className="p-4 border rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{b.movie.title}</h3>
            <p><strong>Suất chiếu:</strong> {b.showtime}</p>
            <p><strong>Ghế:</strong> {b.selectedSeats.join(', ')}</p>
            <p><strong>Khách:</strong> {b.customer.name} - {b.customer.phone}</p>
            <p className="text-sm text-gray-500">
              Đặt lúc: {new Date(b.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
