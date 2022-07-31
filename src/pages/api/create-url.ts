import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../services/prisma'
import { nanoid } from 'nanoid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body

  if (!url || typeof url !== 'string') {
    res.status(404)
    res.send(JSON.stringify({ message: 'No url provided.' }))
    return
  }

  const data = await prisma.shortLink.create({
    data: {
      url,
      slug: nanoid(5),
    },
  })


  return res.status(200).json({ url: data.slug })
}
