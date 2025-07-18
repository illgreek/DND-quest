'use client'

import { Suspense } from 'react'
import SignInForm from '@/app/auth/signin/SignInForm' 

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl text-yellow-400 mb-4">Завантаження...</h1>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
} 