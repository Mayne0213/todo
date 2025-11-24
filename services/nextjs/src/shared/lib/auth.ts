import { NextRequest } from 'next/server'

export const SESSION_COOKIE_NAME = 'todo-auth-session'

/**
 * 요청이 인증되었는지 확인
 */
export function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  return session === 'authenticated'
}

/**
 * 인증되지 않은 요청에 대한 응답 생성
 */
export function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ success: false, error: '인증이 필요합니다' }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

