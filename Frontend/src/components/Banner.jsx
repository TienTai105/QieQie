import React from 'react';

const Banner = () => {
  return (
    <section
      className="relative bg-cover bg-center h-[500px] text-white"
      style={{
        backgroundImage:
          "url('https://image.tmdb.org/t/p/original/rRcNmiH55Tz0ugUsDUGmj8Bsa4V.jpg')",
      }}
    >
      <div className="bg-black bg-opacity-60 h-full w-full flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Guardians of the Galaxy</h1>
          <p className="text-lg md:text-xl mb-6">
            Một nhóm anh hùng ngoài vũ trụ bảo vệ ngân hà khỏi các thế lực xấu xa.
          </p>
          <button className="bg-[#1a1a2e] font-bold text-[#1a1a2e] hover:bg-yellow-400 hover:text-white transition text-white px-6 py-3 rounded-full text-lg">
            MUA VÉ NGAY
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
