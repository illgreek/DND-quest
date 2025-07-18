import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      heroName?: string | null
      heroClass?: string | null
      heroLevel?: number
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    heroName?: string | null
    heroClass?: string | null
    heroLevel?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    heroName?: string | null
    heroClass?: string | null
    heroLevel?: number
  }
} 