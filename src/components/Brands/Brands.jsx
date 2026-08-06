"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const topProducts = [
  { name: "Mustard Trendy Punjabi", price: 1750, img: "/mustard.jpg" },
  { name: "Charcoal Modern Punjabi", price: 2050, img: "/charcole.jpg" },
  { name: "Light Pink Punjabi", price: 1500, img: "/light pink.jpg" },
  { name: "Classic Off-White Punjabi", price: 2200, img: "/off-white.jpg" },
  { name: "Emerald Green Punjabi", price: 1800, img: "/green.jpg" },
  { name: "Royal Blue Punjabi", price: 2000, img: "/royal blue.jpg" },
];

const ProductCarousel = () => {
  return (
    <section className="relative overflow-hidden py-10">
      {/* Background Glow */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
        >
          {topProducts.map((product, index) => (
            <SwiperSlide key={index}>
              <div className="mx-auto max-w-sm">
                <div className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/40">
                  {/* Badge */}
                  <div className="absolute left-4 top-4 z-20 rounded-full border border-white/20 bg-black/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                    Best Seller
                  </div>

                  {/* Image */}
                  <div className="relative h-[420px] overflow-hidden">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>

                  {/* Product Info */}
                  <div className="absolute bottom-0 w-full p-6 text-white">
                    <h3 className="text-2xl font-bold">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-3xl font-bold text-emerald-300">
                      ৳ {product.price}
                    </p>

                    <button className="mt-5 w-full rounded-xl border border-white/20 bg-white/10 py-3 font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black">
                      Shop Now →
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductCarousel;