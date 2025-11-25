'use client'

import { useState, ReactNode, useEffect } from 'react'
import { Input, Button } from '../../../shared/ui'

interface PasswordModalProps {
  children: ReactNode
}

export default function PasswordModal({ children }: PasswordModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/password', {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.success && data.authenticated) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setError(data.error || '비밀번호가 일치하지 않습니다.')
        setPassword('')
      }
    } catch (error) {
      console.error('인증 요청 실패:', error)
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.')
      setPassword('')
    }
  }

  // 인증 상태 확인 중일 때 로딩 표시
  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <p className="text-gray-600">확인 중...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          비밀번호 입력
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Todo 앱에 접근하려면 비밀번호를 입력하세요.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500/20"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-md font-medium"
          >
            확인
          </Button>
        </form>
      </div>
    </div>
  )
}

