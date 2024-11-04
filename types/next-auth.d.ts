import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null
      name?: string | null
      role?: string
      username?: string
      
    }
  }
} 