"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination,EffectFade } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroCarousel() {
  const images = [
    "/604821b7-5597-4b36-b05c-06bae96e4b72.jpg",
    "/kurta1.jpg",
    "/kurta2.jpg",
    "/kurta3.jpg",
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden">
    <Swiper
  modules={[Autoplay, Navigation, Pagination,EffectFade]}
  effect="fade"
  fadeEffect={{ crossFade: true }}
  autoplay={{ delay: 3000, disableOnInteraction: false }}
  loop={true}
  slidesPerView={1}
  navigation
  pagination={{ clickable: true }}
  className="h-full w-full"
>
        {images.map((img, index) => (
          <SwiperSlide key={index} className="h-full w-full">
            <div
              className="relative w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Content */}
                <div
        className={`relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 
        ${index === 1 || index === 3 ? "animate-fadeUp" : ""}`}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Discover Your <span className="text-green-400">Style</span>
        </h1>
        <Link href="/products" className="btn btn-primary">
          Shop Now
        </Link>
      </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}