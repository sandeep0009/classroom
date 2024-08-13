import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/models/userSchema";

const authOptions:NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials:any): Promise<any> {
        await dbConnect();
        try {
          console.log(credentials.email)
        
          const user = await userModel.findOne({ email: credentials.email });
          console.log(user)
          

          if (!user) {
            return null; 
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user; 
          } else {
            return null; 
          }
        } catch (error: any) {
          console.log("Error in NextAuth authorize:", error);
          return null; 
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id.toString();
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages:{
    signIn: '/signin'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
