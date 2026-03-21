import NextAuth from "next-auth";
import { authOptionss } from "@/app/lib/nextauth";

const handler = NextAuth(authOptionss);

export { handler as GET, handler as POST };