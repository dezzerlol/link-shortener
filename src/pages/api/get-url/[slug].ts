import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../services/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query['slug']

  if (!slug || typeof slug !== 'string') {
    res.status(404)
    res.send(JSON.stringify({ message: 'No slug provided.' }))
    return
  }

  const data = await prisma.shortLink.findFirst({
    where: {
      slug,
    },
  })

  if (!data) {
    res.status(404)
    res.send(JSON.stringify({ message: 'Slug not found' }))
    return
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=100000000, stale-while-revalidate')
  return res.json(data)
}
