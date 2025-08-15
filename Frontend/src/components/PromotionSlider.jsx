import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PromotionSlider = ({ promotions }) => {
  const visibleCount = 3;
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(promotions.length - visibleCount, 0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Auto slide, quay lại đầu khi đến cuối sau 4s
  useEffect(() => {
    let timer;

    if (currentIndex < maxIndex) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 4000);
    } else {
      timer = setTimeout(() => {
        setCurrentIndex(0);
      }, 4000);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [currentIndex, maxIndex]);

  return (
    <div className="relative max-w-6xl mx-auto overflow-hidden rounded-xl">
      {/* Slider container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
          width: `${(promotions.length * 100) / visibleCount}%`,
        }}
      >
        {promotions.map((promo) => (
          <div key={promo._id} className="w-1/4 px-2 flex-shrink-0">
            <img
              src={promo.image}
              alt={promo.title}
              className="h-[200px] w-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:text-yellow-400 z-10"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:text-yellow-400 z-10"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 w-2 rounded-full ${
              currentIndex === i ? 'bg-yellow-400' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionSlider;
