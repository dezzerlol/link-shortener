import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const slug = req.nextUrl.pathname.split('/').pop()

  const fetched = await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)
  if (fetched.status === 404) {
    return NextResponse.redirect(req.nextUrl.origin)
  }

  const data = await fetched.json()

  if (data?.url) {
    return NextResponse.redirect(data.url)
  }

  console.log('data', data)
}

export const config = {
  matcher: '/:slug',
}
