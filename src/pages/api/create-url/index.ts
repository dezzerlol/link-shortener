import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../services/prisma'
import { nanoid } from 'nanoid'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!url || typeof url !== 'string') {
    res.status(404)
    res.send(JSON.stringify({ message: 'No url provided.' }))
    return
  }

  let data

  if (!session) {
    data = await prisma.shortLink.create({
      data: {
        url,
        slug: nanoid(5),
      },
    })
  } else {
    data = await prisma.shortLink.create({
      data: {
        url,
        slug: nanoid(5),
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })
  }

  return res.status(200).json(data)
}
