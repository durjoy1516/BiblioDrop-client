"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { ArrowRight, BookOpen } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: "Your Local Library, Delivered Right To You",
    subtitle: "Connecting readers with local libraries & independent book owners.",
    bgImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200",
  },
  {
    id: 2,
    title: "Thousands of Books, One Simple Request",
    subtitle: "Doorstep delivery with real-time tracking and verified reviews.",
    bgImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200",
  },
];

export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden theme-bg-main">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-cover bg-center py-16 px-4"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.45)), url(${slide.bgImage})`,
              }}
            >
              <div className="max-w-4xl mx-auto text-center text-white space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs md:text-sm font-semibold backdrop-blur-md"
                >
                  <BookOpen className="w-4 h-4" /> BiblioDrop Marketplace
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl md:text-6xl font-extrabold leading-tight tracking-wide"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto font-light"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="pt-4"
                >
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/30 hover:scale-105"
                  >
                    Browse Books <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}