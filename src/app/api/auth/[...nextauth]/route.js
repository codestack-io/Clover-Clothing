import NextAuth from "next-auth";
<<<<<<< HEAD
import { authOptions } from "../../../lib/authoptions";
=======
import { authOptions } from "@/app/lib/authOptions";
>>>>>>> temp-branch

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
