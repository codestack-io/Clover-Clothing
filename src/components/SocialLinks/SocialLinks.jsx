"use client";

import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa"; // Using react-icons for clean SVG icons
import { SiTiktok } from "react-icons/si"; 

const SocialLinks = ({ facebook, instagram,tiktok }) => {
  return (
    <div className="mt-6 text-center md:text-left">
      {/* Subtitle */}
      <p className="text-gray-700 font-semibold mb-2 text-lg">
        Discover exclusive deals and updates! Follow us on social media:
      </p>

      {/* Social Icons */}
      <div className="flex gap-4 justify-center md:justify-start items-center mt-2">
        {/* Facebook */}
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

        {/* Instagram */}
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
  );
};

export default SocialLinks;