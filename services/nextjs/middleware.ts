import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated, createUnauthorizedResponse } from '@/shared/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 공개 경로 (인증 불필요)
  const publicPaths = [
    '/api/auth/password', // 비밀번호 인증 API
    '/api/health', // 헬스체크
  ]

  // 공개 경로는 통과
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // API 라우트 보호
  if (pathname.startsWith('/api/')) {
    if (!isAuthenticated(request)) {
      return createUnauthorizedResponse()
    }
    return NextResponse.next()
  }

  // 페이지 라우트 보호
  if (pathname === '/' || pathname.startsWith('/app')) {
    if (!isAuthenticated(request)) {
      // 인증되지 않은 경우, 클라이언트에서 처리하도록 그대로 진행
      // (PasswordModal이 표시됨)
      return NextResponse.next()
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

