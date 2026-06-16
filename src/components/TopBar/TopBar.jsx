import React from 'react';
import Link from "next/link";


const TopBar = () => {
    return (
         <div className="bg-gray-200 py-2 w-full mx-auto">
      <div className="max-w-6xl mx-auto flex justify-end items-center gap-6 text-sm font-medium">
        
        {/* Bangladesh Flag Dot */}
        <div className="w-4 h-4 rounded-full bg-green-600 relative">
          <div className="w-2 h-2 bg-red-600 rounded-full absolute top-1 left-1"></div>
        </div>

        <span className='text-black'>|</span>

        <button className="hover:text-green-600 transition text-black">
          EN
        </button>

        <span className='text-black'>|</span>

        <button className="hover:text-green-600 transition text-black">
          BDT
        </button>

        <Link href="/help">
<<<<<<< HEAD
       <button className="hover:text-green-600 transition text-black">
        Need help?
      </button>
     </Link>

     <Link href="/admin/help">
       <button className="hover:text-green-600 transition text-black">
        Answer?
      </button>
     </Link>

     <Link href="/help/qn/a">
       <button className="hover:text-green-600 transition text-black">
        QN/A
      </button>
     </Link>

=======
  <button className="hover:text-green-600 transition text-black">
    Need help?
  </button>
</Link>
   <Link href="/admin/help">
  <button className="hover:text-green-600 transition text-black">
    Answer?
  </button>
</Link>
<Link href="/help/qn/a">
  <button className="hover:text-green-600 transition text-black">
    QN/A
  </button>
</Link>
>>>>>>> temp-branch
       
<Link href="/my-account">
  <button className="px-4 py-2 bg-black text-white rounded">
    My Account
  </button>
</Link>

      </div>
     
        
      
    </div>
    );
};

export default TopBar;