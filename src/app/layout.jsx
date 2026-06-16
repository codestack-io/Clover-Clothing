import { Rubik, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layouts/Navbar";
import Footer from "@/components/Layouts/Footer";
import TopBar from "@/components/TopBar/TopBar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const rubik = Rubik({
  weight: ["300","400","500","600","700","800","900"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={cn("font-sans", inter.variable)}>
      <body className={`${rubik.className} antialiased bg-gray-200`}>

        <AuthProvider>

          {/* Cart context available to entire app */}
          <CartProvider>

            <header className="md:w-full mx-auto">
              <TopBar />
              <Navbar />z
            </header>

            <main className="w-full px-5 py-2 min-h-[calc(100vh-330px)]">
              {children}
            </main>

            <Footer />

          </CartProvider>

        </AuthProvider>

      </body>
    </html>
  );
}