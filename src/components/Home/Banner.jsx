"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    img: "/604821b7-5597-4b36-b05c-06bae96e4b72.jpg",
    eyebrow: "Autumn Edit",
    title: "Discover Your",
    highlight: "Style",
    sub: "Considered layers, cut for every season.",
    ctaLabel: "Shop Now",
    ctaHref: "/items",
  },
  {
    img: "/kurta1.jpg",
    eyebrow: "New Arrival",
    title: "Heritage Made",
    highlight: "Modern",
    sub: "Hand-finished kurtas, reimagined for today.",
    ctaLabel: "Explore Kurtas",
    ctaHref: "/items?category=kurta",
  },
  {
    img: "/kurta2.jpg",
    eyebrow: "Best Seller",
    title: "Quiet Luxury,",
    highlight: "Everyday",
    sub: "Fabrics chosen for how they feel, not just how they look.",
    ctaLabel: "Shop Now",
    ctaHref: "/items",
  },
  {
    img: "/kurta3.jpg",
    eyebrow: "Featured Collection",
    title: "Crafted To",
    highlight: "Last",
    sub: "Timeless silhouettes built for the long run.",
    ctaLabel: "View Collection",
    ctaHref: "/items?category=featured",
  },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="group relative h-screen w-full overflow-hidden bg-[#111]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={1100}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          renderBullet: (index, className) =>
            `<span class="${className} hero-bullet"><span class="hero-bullet-fill"></span></span>`,
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.img} className="h-full w-full">
            <div className="relative h-full w-full overflow-hidden">
              <div
                className={`hero-kb absolute inset-0 bg-cover bg-center ${
                  activeIndex === index ? "hero-kb-active" : ""
                }`}
                style={{ backgroundImage: `url(${slide.img})` }}
              />

              {/* Layered gradient — grounds the text without flattening the image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Text content — synced to activeIndex, not tied to a single slide's DOM node */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex flex-col items-center"
          >
            <span className="mb-5 text-[11px] font-medium uppercase tracking-[0.32em] text-white/70">
              {slides[activeIndex].eyebrow}
            </span>

            <h1 className="text-4xl font-light leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              {slides[activeIndex].title}{" "}
              <span className="font-semibold italic text-[#4ade80]">
                {slides[activeIndex].highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-md text-[15px] font-light tracking-wide text-white/75 md:text-base">
              {slides[activeIndex].sub}
            </p>

            <Link
              href={slides[activeIndex].ctaHref}
              className="group/cta mt-10 inline-flex items-center gap-2.5 border border-white/40 px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#111]"
            >
              {slides[activeIndex].ctaLabel}
              <ArrowRight
                size={15}
                strokeWidth={1.75}
                className="transition-transform duration-300 group-hover/cta:translate-x-1"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom navigation arrows — hidden until the hero is hovered */}
      <button
        ref={prevRef}
        aria-label="Previous slide"
        className="absolute left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white/20 group-hover:opacity-100 md:left-8"
      >
        <ChevronLeft size={18} strokeWidth={1.75} />
      </button>
      <button
        ref={nextRef}
        aria-label="Next slide"
        className="absolute right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white/20 group-hover:opacity-100 md:right-8"
      >
        <ChevronRight size={18} strokeWidth={1.75} />
      </button>

      {/* Custom pagination — slim progress bars instead of dots */}
      <div className="hero-pagination absolute bottom-9 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5" />

      <style jsx global>{`
        .hero-kb {
          transform: scale(1.06);
          transition: transform 7s ease-out;
        }
        .hero-kb-active {
          transform: scale(1);
        }

        .hero-pagination {
          display: flex;
        }
        .hero-bullet {
          position: relative;
          display: block;
          width: 34px;
          height: 3px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          overflow: hidden;
          opacity: 1;
        }
        .hero-bullet-fill {
          position: absolute;
          inset: 0;
          width: 0%;
          background: #ffffff;
        }
        .swiper-pagination-bullet-active .hero-bullet-fill {
          animation: hero-fill 5s linear forwards;
        }
        @keyframes hero-fill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}