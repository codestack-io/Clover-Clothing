import { Rubik } from "next/font/google";
import "./globals.css";

import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";
import TopBar from "../components/TopBar/TopBar";
import Providers from "./provides";

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${rubik.className} antialiased bg-white text-gray-900 transition-colors duration-300`}
      >
        <Providers>
          <header className="w-full bg-white">
            <TopBar />
            <Navbar />
          </header>

          <main className="w-full min-h-[calc(100vh-330px)] bg-white text-gray-900">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}