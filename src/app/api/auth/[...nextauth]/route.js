import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials;

          const collection = await dbConnect(Collection.USERS);
          const user = await collection.findOne({ email });

          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || "User",
            role: user.role || "user",
          };
        } catch (error) {
          console.error("AUTH ERROR:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      const collection = await dbConnect(Collection.USERS);

      const isExist = await collection.findOne({
        email: user.email,
        provider: account?.provider,
      });

      if (isExist) return true;

      const newUser = {
        provider: account?.provider,
        name: user.name,
        email: user.email,
        image: user.image,
        role: "user",
      };

      const result = await collection.insertOne(newUser);
      return result.acknowledged;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user";
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };