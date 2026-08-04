/**
 * tailwind.config.snippet.js
 * -----------------------------------------------------------------------
 * Not a standalone config — merge these pieces into your existing
 * tailwind.config.js (or tailwind.config.ts). Only two things are
 * required for the FAQ section to render correctly:
 *
 *   1. darkMode: "class"   → lets dark: classes respond to a `.dark`
 *      class on <html>, instead of only the OS-level preference.
 *   2. the `clover` color scale used throughout the FAQ components.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // toggle dark mode by adding/removing `dark` on <html>
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clover Clothing brand green — used for accents, active states,
        // and the primary CTA throughout the FAQ section.
        clover: {
          50: "#f3f8f3",
          100: "#e3efe3",
          200: "#c8dfc9",
          300: "#9fc7a2",
          400: "#6fa876",
          500: "#4c8a54",
          600: "#3a6f41", // primary
          700: "#2f5936",
          800: "#28472d",
          900: "#1f3623",
          950: "#0f2013",
        },
      },
      fontFamily: {
        // Optional — pair with next/font in app/layout.js if you want the
        // serif/sans pairing used in the design brief:
        //   import { Fraunces, Inter } from "next/font/google";
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};