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

  // Si no hay cookie, dejamos pasar — el AuthProvider en cliente maneja el redirect.
  // Esto evita que la navegación SPA pierda sesión entre rutas.
  if (!cookie) return NextResponse.next()

  try {
    const user = JSON.parse(decodeURIComponent(cookie))
    if (needsAgent && user.role === 'client') {
      return NextResponse.redirect(new URL('/client/inicio', req.url))
    }
    if (needsClient && user.role !== 'client') {
      return NextResponse.redirect(new URL('/agent/dashboard', req.url))
    }
  } catch {
    // Cookie malformada — dejamos pasar, el cliente maneja el estado
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/agent/:path*', '/client/:path*'],
}
