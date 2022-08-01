import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../services/prisma'
import { nanoid } from 'nanoid'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { linkId } = req.body
  const session = await unstable_getServerSession(req, res, authOptions)
  const userId = session?.user?.id
  if (!session) {
    res.status(404).json({ message: 'Not authorized' })
  }

  if (!linkId) {
    res.status(404)
    res.send(JSON.stringify({ message: 'No link id provided.' }))
    return
  }

  const data = await prisma.shortLink.deleteMany({
    where: {
      id: linkId,
      userId,
    },
  })

  return res.status(200).json({ message: 'Success' })
}
