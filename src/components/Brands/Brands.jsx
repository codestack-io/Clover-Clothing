"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

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
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      loop={true}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      modules={[Autoplay]}
    >
      {topProducts.map((product, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-col items-center bg-white p-4 rounded shadow">
            <img src={product.img} alt={product.name} className="w-40 h-40 object-cover mb-2" />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-green-600 font-bold">৳{product.price}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductCarousel;