import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect,Collection } from "./dbConnect";
import { loginUser } from "./loginUser"; 

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
    
    name: 'Credentials',
   
   credentials: {
  email: { label: "Email", type: "email" },
  password: { label: "Password", type: "password" }
},
    async authorize(credentials) {
      console.log("Credentials received in authorize:", credentials);
      const user = await loginUser(credentials);
      return user;
    }
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
})
  ],
  callbacks: {
  async signIn({ user, account, profile, email, credentials }) {
    console.log({ user, account, profile, email, credentials });
    
    const isExist = await dbConnect(Collection.USERS).findOne({
  email: user.email,
  provider: account?.provider,
});
    if (isExist) {
       return true;
    }
    

  const newUser = {
  provider: account?.provider,
  name: user.name,
  email: user.email,
  image: user.image,
  role: "user",
};
    const result=await dbConnect(Collection.USERS).insertOne(newUser);
    return result.acknowledged;


  
    //return true
  },
  // async redirect({ url, baseUrl }) {
  //   return baseUrl
  // },
  async session({ session, token }) {

  
  if (session?.user) {
    session.user.role = token.role;
    session.user.email = token.email;
  }
  return session;
},
   async jwt({ token, user,account}) {
    console.log("account data in token",account)

    if(user){
    token.role = user.role || "user";
    token.email=user.email;
    }
     return token
   }
}
}