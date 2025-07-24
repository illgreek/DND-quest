'use client'

import SignInForm from './SignInForm'

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#d4c6ff] mb-2">
            Вітаємо назад!
          </h1>
          <p className="text-gray-300">
            Увійдіть у світ епічних пригод
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
} 