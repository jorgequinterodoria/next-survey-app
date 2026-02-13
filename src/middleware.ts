import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Solo aplicar middleware a rutas que empiecen con /admin
  if (path.startsWith('/admin')) {
    const cookie = request.cookies.get('session')?.value
    const session = cookie ? await decrypt(cookie) : null

    // Si intenta acceder al login
    if (path === '/admin/login') {
      // Si ya tiene sesión válida, redirigir al dashboard
      if (session?.expires && new Date(session.expires) > new Date()) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      // Si no tiene sesión, dejar pasar al login
      return NextResponse.next()
    }

    // Para cualquier otra ruta protegida de admin
    // Si no tiene sesión válida, redirigir al login
    if (!session?.expires || new Date(session.expires) <= new Date()) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
