
import Banner from "@/components/Home/Banner";
import Products from "@/components/Home/Products";
import Brands from "@/components/Brands/Brands";
import TopCategoriesSection from "@/components/TopCategories/TopCategories";
import { getServerSession } from "next-auth";

import { authOptions } from "./lib/authOptions";
import SocialLinks from "@/components/SocialLinks/SocialLinks";

export default async function Home() {
  const session= await getServerSession(authOptions);
  return (
    <div className="space-y-30">
     
      
      <section>
        <Banner></Banner>
        <Brands></Brands>
        <div className="w-full">
      <TopCategoriesSection />
      </div>
        <Products limit={9} />
        <SocialLinks
         facebook="https://www.facebook.com/profile.php?id=61587012395509"
         instagram="https://www.instagram.com/Clover-"
         tiktok="https://www.tiktok.com/Clover-clothing" >
         
         </SocialLinks>
      </section>
       
        
      
     
     
    </div>
  );
}
