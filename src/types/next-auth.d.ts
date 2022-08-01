import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      emailVerified: boolean
      image: string
    }
    expires: string
  }

  interface User {
    email: string
    name: string
    emailVerified: boolean
    password: string
    createdAt: string
    image: string
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    email: string
    picture: string
    sub: string
    user: {
      id: string
      name: string
      email: string
      emailVerified: boolean
      password: string
      image: string
      createdAt: string
    }
    iat: number
    exp: number
    jti: string
  }
}
