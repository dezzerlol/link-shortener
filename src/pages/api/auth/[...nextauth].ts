import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import prisma from '../../../services/prisma'



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',

  },
  providers: [
 
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user)

      return token
    },

    session: async ({ session, token }) => {
      session.user = {
        id: token.user.id,
        name: token.user.name,
        image: token.user.image,
        email: token.user.email,
        emailVerified: token.user.emailVerified,
      }

      return session
    },
  },
}

export default NextAuth(authOptions)
