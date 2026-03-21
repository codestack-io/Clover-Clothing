import GoogleProvider from "next-auth/providers/google";
import { dbConnect, Collection } from "@/app/lib/dbConnect";

export const authOptionss = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
  try {
    console.log("🔥 SIGNIN CALLBACK TRIGGERED");

    const usersCollection = await dbConnect(Collection.USERS);

    const newUser = {
      provider: account?.provider,
      name: user.name,
      email: user.email,
      image: user.image,
      role: "user",
      loginTime: new Date(), // ✅ important
    };

    const result = await usersCollection.insertOne(newUser);

    console.log("✅ Inserted every login:", result);

    return true;
  } catch (err) {
    console.error("❌ Error:", err);
    return false;
  }
},
    async session({ session, token }) {
      session.user.role = token.role || "user";
      return session;
    },

    async jwt({ token, user }) {
      if (user) token.role = "user"; // default role
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};