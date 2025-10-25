import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/auth/signin', '/api/auth']

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // If not authenticated and trying to access protected route, redirect to login
  if (!req.auth && !isPublicPath) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated and trying to access login, redirect to dashboard
  if (req.auth && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
