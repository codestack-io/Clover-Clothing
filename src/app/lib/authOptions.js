import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect, Collection } from "../../app/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const { email, password } = credentials;

          if (!email || !password) return null;

          const collection = await dbConnect(Collection.USERS);
          const user = await collection.findOne({ email });

          // ❌ User not found or no password set
          if (!user || !user.password) return null;

          // ❌ ONLY allow users with role "admin" to log in
          if (user.role !== "admin") {
            console.warn(`Unauthorized login attempt by non-admin: ${email}`);
            return null;
          }

          // 🔑 Verify password hash
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          // ✅ Return user object with role attached
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || "Admin",
            role: user.role,
          };
        } catch (error) {
          console.error("AUTH ERROR:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Pass user details to the JWT token on login
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // Pass role and ID from token to client session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin/login", // Redirect to dedicated admin login route
  },

  secret: process.env.NEXTAUTH_SECRET,
};