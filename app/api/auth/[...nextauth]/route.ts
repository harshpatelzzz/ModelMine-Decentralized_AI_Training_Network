import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextRequest } from "next/server"

// Mock user database (in production, use a real database)
const users = [
  {
    id: "1",
    email: "admin@datn.io",
    password: "admin123", // In production, hash passwords
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "user@datn.io",
    password: "user123",
    name: "Test User",
    role: "user",
  },
]

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
}

const { handlers } = NextAuth(authOptions)

export const GET = handlers.GET
export const POST = handlers.POST

