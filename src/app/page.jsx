
import Banner from "../components/Home/Banner";
import Products from "../components/Home/Products";
import Brands from "../components/Brands/Brands";

import { getServerSession } from "next-auth";
import  SocialLinks from "../components/SocialLinks/SocialLinks"
import { authOptions } from "../app/lib/authOptions";

export default async function Home() {
  const session= await getServerSession(authOptions);
  return (
    <div  className="max-w-full ">
     
      
      <section className="w-full">
        <section >
       <Banner />
       </section>
       <section >
      <Brands />
      </section>

     
      <section className="py-10">
        <Products limit={9} />
        <SocialLinks
         facebook="https://www.facebook.com/profile.php?id=61587012395509"
         instagram="https://www.instagram.com/Clover-"
         tiktok="https://www.tiktok.com/Clover-clothing" >
         
         </SocialLinks>
        </section>
      </section>
       
        
      
     
     
    </div>
  );
}
