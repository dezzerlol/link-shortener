import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../services/prisma'
import { nanoid } from 'nanoid'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(404).json({ message: 'Not authorized' })
  }

  const links = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      ShortLink: true,
    },
  })

  return res.status(200).json(links?.ShortLink)
}
