<<<<<<< HEAD
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
=======
// JavaScript
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const slides = [
    {
        id: 1,
        title: 'Guardians of the Galaxy',
        desc: 'Một nhóm anh hùng ngoài vũ trụ bảo vệ ngân hà khỏi các thế lực xấu xa.',
        image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1400&auto=format&fit=crop',
        cta: { to: '/movies/now-showing', label: 'Mua vé ngay' },
    },
    {
        id: 2,
        title: 'Superman',
        desc: 'Biểu tượng công lý trở lại màn ảnh với hành trình mới đầy kịch tính.',
        image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1400&auto=format&fit=crop',
        cta: { to: '/movies/now-showing', label: 'Đặt chỗ' },
    },
    {
        id: 3,
        title: 'The Last Wish',
        desc: 'Cuộc phiêu lưu cảm động về ước nguyện cuối cùng.',
        image: 'https://images.unsplash.com/photo-1502136969935-8d0710f597e9?q=80&w=1400&auto=format&fit=crop',
        cta: { to: '/movies/coming-soon', label: 'Khám phá' },
    },
];

const Banner = () => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[index];

    return (
        <section className="relative mt-[92px]">
            <div className="relative h-[38vh] md:h-[52vh] overflow-hidden max-w-7xl mx-auto rounded-none md:rounded-xl">
                {/* Background */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={slide.id}
                        src={slide.image}
                        alt={slide.title}
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.02, opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Overlay gradient với màu hài hòa với website */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/60 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="px-5 md:px-8 max-w-7xl mx-auto">
                        <motion.h1
                            key={`title-${slide.id}`}
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg"
                        >
                            {slide.title}
                        </motion.h1>
                        <motion.p
                            key={`desc-${slide.id}`}
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mt-2 md:mt-3 text-slate-100 max-w-2xl text-sm md:text-base drop-shadow-md"
                        >
                            {slide.desc}
                        </motion.p>

                        <motion.div
                            key={`cta-${slide.id}`}
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mt-4 flex items-center gap-3"
                        >
                            <Link
                                to={slide.cta.to}
                                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {slide.cta.label}
                            </Link>
                            <Link
                                to="/history"
                                className="bg-slate-700/80 hover:bg-slate-600/90 border border-slate-500/50 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                                Lịch sử
                            </Link>
                        </motion.div>

                        {/* Dots với màu hài hòa */}
                        <div className="absolute bottom-4 left-5 flex gap-2">
                            {slides.map((s, i) => (
                                <button
                                    key={s.id}
                                    onClick={() => setIndex(i)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                        i === index
                                            ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                                            : 'bg-slate-400/60 hover:bg-slate-300/80'
                                    }`}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default Banner;
>>>>>>> b32aa75 (update code)
