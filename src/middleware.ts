import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

function getRoleFromToken(token?: string): string {
  if (!token) return 'auth'
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return 'auth'
    const payloadJson = atob(payloadBase64)
    const payload = JSON.parse(payloadJson)
    return payload.SCOPES.split("ROLE_")[1].toLowerCase().trim() || 'auth'
  } catch {
    return 'auth'
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken: string | undefined = request.cookies.get('ACCESS')?.value
  const role: string | undefined = getRoleFromToken(accessToken)

  if (accessToken === undefined || role === undefined) {
    if (pathname.includes('/auth/'))
      return NextResponse.next()
    else
      return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  //--Request role is appropriate with url. 
  if (pathname.includes(role))
    return NextResponse.next()
  
  return NextResponse.redirect(new URL(`/${role}/home`, request.url))
}

export const config = {
  matcher: [
    '/pm/:path*',
    '/lead/:path*',
    '/emp/:path*',
    '/auth/:path*',
  ],
};