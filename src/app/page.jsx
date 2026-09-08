import Banner from "../components/Home/Banner";
import Products from "../components/Home/Products";
import Brands from "../components/Brands/Brands";

import { getServerSession } from "next-auth";
import SocialLinks from "../components/SocialLinks/SocialLinks";
import { authOptions } from "../app/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="w-full min-h-screen bg-white text-neutral-900">
      <section className="w-full">
        <Banner />
      </section>

      <section className="w-full bg-white">
        <Brands />
      </section>

      <section className="w-full bg-white py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Products limit={9} />
        
        <div className="mt-12">
          <SocialLinks
            facebook="https://www.facebook.com/profile.php?id=61587012395509"
            instagram="https://www.instagram.com/Clover-"
            tiktok="https://www.tiktok.com/Clover-clothing"
          />
        </div>
      </section>
    </div>
  );
}