import React, { useState } from 'react';

const rows = 5;
const cols = 8;

// Giả lập ghế đã đặt sẵn
const bookedSeats = ['B2', 'C3', 'D4', 'E5'];

const SeatSelector = ({ onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // Không thể chọn ghế đã đặt

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    onConfirm(selectedSeats);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Chọn ghế ngồi</h2>

      <div className="grid grid-cols-8 gap-2 mb-4">
        {[...Array(rows)].map((_, rowIndex) => {
          const rowLabel = String.fromCharCode(65 + rowIndex); // A, B, C...
          return [...Array(cols)].map((_, colIndex) => {
            const seat = `${rowLabel}${colIndex + 1}`;
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            let bgColor = 'bg-white';
            if (isBooked) bgColor = 'bg-gray-400 cursor-not-allowed';
            else if (isSelected) bgColor = 'bg-red-500 text-white';

            return (
              <button
                key={seat}
                className={`w-10 h-10 text-sm font-medium rounded ${bgColor} border hover:bg-red-300 transition`}
                onClick={() => toggleSeat(seat)}
                disabled={isBooked}
                title={seat}
              >
                {seat}
              </button>
            );
          });
        })}
      </div>

      <div className="mt-4">
        {selectedSeats.length > 0 && (
          <p className="mb-2 text-green-700">
            Ghế đã chọn: {selectedSeats.join(', ')}
          </p>
        )}
        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
          className={`px-6 py-3 rounded text-white text-lg ${
            selectedSeats.length > 0
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Xác nhận ghế
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;
