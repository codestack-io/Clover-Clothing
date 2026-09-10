// src/app/lib/authOptions.js
import CredentialsModule from "next-auth/providers/credentials";
import { dbConnect, Collection } from "./dbConnect";
import bcrypt from "bcryptjs";

const CredentialsProvider = CredentialsModule.default || CredentialsModule;

export const authOptions = {
  // ⚠️ Ensures NextAuth always has a secret key even if .env fails to parse
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-key-for-local-dev-12345", 
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.toLowerCase().trim();
          const password = credentials?.password;

          if (!email || !password) return null;

          const collection = await dbConnect(Collection?.USERS || "users");
          const user = await collection.findOne({ email });

          if (!user || !user.password || user.role !== "admin") return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || "Admin",
            role: user.role,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};