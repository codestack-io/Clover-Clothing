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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rubik.className} antialiased bg-gray-100 text-gray-900 dark:text-white transition-colors duration-300 dark:bg-slate-950 dark:text-white`}
      >
        <Providers>
          <header className="w-full">
            <TopBar />
            <Navbar />
          </header>

          <main className="w-full px-5 py-2 min-h-[calc(100vh-330px)]">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}