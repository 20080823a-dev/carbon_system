import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "系統登入",
      credentials: {
        email: { label: "信箱", type: "email", placeholder: "test@example.com" },
        password: { label: "密碼", type: "password" }
      },
      async authorize(credentials) {
        console.log("1. 接收到的帳密：", credentials);
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email as string } 
        });
        console.log("2. 資料庫找出的用戶：", user);
        if (!user) return null;
        
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        console.log("3. 密碼比對結果：", isPasswordMatch);
        if (!isPasswordMatch) return null;
        
        return { 
          id: String(user.id), 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } as any; 
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // 1. 將 authorize 回傳的 role 存入 JWT token
    async jwt({ token, user }: any) {
      console.log("進入 JWT 階段:", user); 
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // 2. 將 JWT token 中的 role 暴露給前端 Session
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };