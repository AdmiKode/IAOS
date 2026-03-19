import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_AGENT  = ['/agent']
const PROTECTED_CLIENT = ['/client']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const needsAgent  = PROTECTED_AGENT.some(p  => pathname.startsWith(p))
  const needsClient = PROTECTED_CLIENT.some(p => pathname.startsWith(p))

  if (!needsAgent && !needsClient) return NextResponse.next()

  // La sesión se guarda en cookie 'iaos-user' (JSON) — seteada desde el AuthProvider en cliente.
  // En middleware leemos la cookie para validar rol.
  const cookie = req.cookies.get('iaos-user')?.value

  if (!cookie) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const user = JSON.parse(cookie)
    if (needsAgent && user.role === 'client') {
      return NextResponse.redirect(new URL('/client/inicio', req.url))
    }
    if (needsClient && user.role !== 'client') {
      return NextResponse.redirect(new URL('/agent/dashboard', req.url))
    }
  } catch {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/agent/:path*', '/client/:path*'],
}
