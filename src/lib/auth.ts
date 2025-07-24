import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            heroName: true,
            heroClass: true,
            heroLevel: true,
            experience: true,
            gold: true,
            hasSeenTutorial: true,
            themeType: true,
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          heroName: user.heroName,
          heroClass: user.heroClass,
          heroLevel: user.heroLevel,
          experience: user.experience,
          gold: user.gold,
          hasSeenTutorial: user.hasSeenTutorial,
          themeType: user.themeType,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.heroName = user.heroName
        token.heroClass = user.heroClass
        token.heroLevel = user.heroLevel
        token.experience = user.experience
        token.gold = user.gold
        token.hasSeenTutorial = user.hasSeenTutorial
        token.themeType = user.themeType
        
        console.log('NextAuth JWT callback - user data:', {
          userId: user.id,
          hasSeenTutorial: user.hasSeenTutorial,
          themeType: user.themeType
        })
      }
      
      // Оновлюємо токен при зміні сесії
      if (trigger === "update" && session) {
        token.heroLevel = session.user.heroLevel
        token.experience = session.user.experience
        token.gold = session.user.gold
        token.hasSeenTutorial = session.user.hasSeenTutorial
        token.themeType = session.user.themeType
        
        console.log('NextAuth JWT callback - session update:', {
          userId: token.sub,
          hasSeenTutorial: session.user.hasSeenTutorial,
          themeType: session.user.themeType
        })
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.heroName = token.heroName
        session.user.heroClass = token.heroClass
        session.user.heroLevel = token.heroLevel
        session.user.experience = token.experience
        session.user.gold = token.gold
        session.user.hasSeenTutorial = token.hasSeenTutorial
        session.user.themeType = token.themeType
        
        console.log('NextAuth session callback:', {
          userId: session.user.id,
          hasSeenTutorial: session.user.hasSeenTutorial,
          themeType: session.user.themeType,
          tokenHasSeenTutorial: token.hasSeenTutorial
        })
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user"
  }
} 