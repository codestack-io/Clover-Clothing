
import NextAuthModule from "next-auth";
import { authOptions } from "../../../lib/authOptions";

// Handle bundler export variations
const NextAuth = NextAuthModule.default || NextAuthModule;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };