"use client";
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";

const AuthButtons = () => {
      const {  status } = useSession();
      const pathname = usePathname();
    return (
        <div>
            {
                status =="authenticated" ? (<>
                <button onClick={()=> signOut({ callbackUrl: window.location.origin + pathname})} className="btn btn-ghost">logout</button>
                
                </> 
            ) : (
            <>
                <Link href={`/auth/login?callbackUrl=${pathname}`} className="btn btn-ghost">Login</Link>  
            </>
            )}
        
        </div>
    );
};

export default AuthButtons;