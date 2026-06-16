"use client";

import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const SocialLinksWithImage = ({ imageSrc, imageAlt, facebook, instagram, tiktok }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-4 md:p-8 bg-white shadow-lg rounded-lg">
      
      {/* Left Div - Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img 
          src={"/social.png"} 
          alt={imageAlt} 
          className="w-full h-auto max-w-sm rounded-lg shadow-md object-cover" 
        />
      </div>

      {/* Right Div - Subtitle + Social Links */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center mt-50 text-center md:items-center md:text-center h-full">
        {/* Subtitle */}
        <p className="text-gray-700 font-semibold mb-4 text-lg">
          Reach us in social handles.Make more connection with us beyond the site.
         </p>

        {/* Social Icons */}
        <div className="flex gap-4 justify-center md:justify-start items-center mt-2">
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition transform hover:scale-110"
              title="Follow us on Facebook"
            >
              <FaFacebookF className="text-lg" />
            </a>
          )}

          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white shadow-md transition transform hover:scale-110"
              title="Follow us on Instagram"
            >
              <FaInstagram className="text-lg" />
            </a>
          )}

          {tiktok && (
            <a
              href={tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-black hover:bg-gray-800 text-white shadow-md transition transform hover:scale-110"
              title="Follow us on TikTok"
            >
              <SiTiktok className="text-lg" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
};

export default SocialLinksWithImage;