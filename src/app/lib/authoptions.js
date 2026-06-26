import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect, Collection } from "../../app/lib/dbConnect";
import bcrypt from "bcryptjs";

console.log("CredentialsProvider:", CredentialsProvider);
console.log("Type:", typeof CredentialsProvider);
export const authOptions = {
  providers: [
    // 🔐 Credentials Login
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

          // ❌ user not found
          if (!user) return null;

          // ❌ no password (Google user)
          if (!user.password) return null;

          // 🔑 check password
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          // ✅ success
         
return {
  id: user._id.toString(),
  email: user.email,
  name: user.name || "User",
  image: user.image || null,
  role: user.role || "user",
};


        } catch (error) {
          console.error("AUTH ERROR:", error);
          return null;
        }
      },
    }),

    // 🌐 Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // ✅ Save user to DB (Google login)
    async signIn({ user, account }) {
      try {
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
      } catch (error) {
        console.error("SIGNIN ERROR:", error);
        return false;
      }
    },

    // ✅ Add role + email to token
     async jwt({ token, user }) {
    if (user) {
      token.id = user._id?.toString();
      token.role = user.role;
    }

    return token;
  },

  async session({ session, token }) {
    session.user.id = token.id;
    session.user.role = token.role;

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