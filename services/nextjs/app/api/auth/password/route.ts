import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, handleCorsPreFlight } from '@/shared/lib/cors'

const PASSWORD = '5364'
const SESSION_COOKIE_NAME = 'todo-auth-session'

// OPTIONS - CORS preflight 처리
export async function OPTIONS() {
  return handleCorsPreFlight()
}

// POST - 비밀번호 인증
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      const response = NextResponse.json(
        { success: false, error: '비밀번호를 입력해주세요' },
        { status: 400 }
      )
      Object.entries(corsHeaders()).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (password === PASSWORD) {
      // 인증 성공 - 세션 쿠키 설정
      const response = NextResponse.json(
        { success: true, message: '인증 성공' },
        { status: 200 }
      )
      
      // HttpOnly 쿠키로 세션 저장 (보안 강화)
      response.cookies.set(SESSION_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24시간
        path: '/',
      })

      Object.entries(corsHeaders()).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    } else {
      const response = NextResponse.json(
        { success: false, error: '비밀번호가 일치하지 않습니다' },
        { status: 401 }
      )
      Object.entries(corsHeaders()).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }
  } catch (error) {
    console.error('Password auth error:', error)
    const response = NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
    Object.entries(corsHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }
}

// GET - 인증 상태 확인
export async function GET(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value
  
  const response = NextResponse.json(
    { success: true, authenticated: session === 'authenticated' },
    { status: 200 }
  )
  Object.entries(corsHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}
