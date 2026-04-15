import NextAuth from "next-auth";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
          const { email, password } = credentials;

          // connect DB
    const collection = await dbConnect(Collection.USERS);

    // find user
    const user = await collection.findOne({ email });
  console.log(user);

    if (!user) {
      throw new Error("User not found");
    }

    // compare password
    const isValid = await bcrypt.compare(password, user.password);
console.log("Password valid:", isValid);
  if (!isValid) {
  throw new Error("Invalid password");
}

// ✅ SUCCESS → return user
return {
  id: user._id.toString(),
  email: user.email,
  name: user.name || "User",
};
      },
      
    }),
  ],
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