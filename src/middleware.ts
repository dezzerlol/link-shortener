import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = req.nextUrl
  // check if pathname equals icon so icon doesnt get redirected
  if (pathname.startsWith('/_next') || pathname.startsWith('/icon.png')) {
    return NextResponse.next()
  }

  // get slug from url
  const slug = req.nextUrl.pathname.split('/').pop()

  // check if slug is valid
  const fetched = await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)
  if (fetched.status === 404) {
    return NextResponse.redirect(req.nextUrl.origin)
  }

  const data = await fetched.json()

  // redirect to url
  if (data?.url) {
    return NextResponse.redirect(data.url)
  }

}

export const config = {
  matcher: '/:slug',
}
