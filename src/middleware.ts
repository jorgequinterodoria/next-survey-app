import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    const cookie = request.cookies.get('session')?.value
    const session = cookie ? await decrypt(cookie) : null
    if (path === '/admin/login') {
      if (session?.expires && new Date(session.expires) > new Date()) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.next()
    }

    if (!session?.expires || new Date(session.expires) <= new Date()) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
