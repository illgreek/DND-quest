'use client'

import SignInForm from './SignInForm'

export default function SignIn() {
  return (
    <div className="min-h-screen bg-[#1a1b26] text-gray-100 relative overflow-hidden flex items-center justify-center">
      {/* Background decorative elements */}
      {/* Floating magical orbs */}
      <div className="absolute top-32 left-8 w-2 h-2 bg-[#624cab] rounded-full opacity-15 animate-pulse animation-delay-1000"></div>
      <div className="absolute top-16 right-12 w-1 h-1 bg-[#a48fff] rounded-full opacity-20 animate-pulse animation-delay-1500"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-[#3d2b6b] rounded-full opacity-10 animate-pulse animation-delay-800"></div>
      <div className="absolute bottom-16 right-8 w-1 h-1 bg-[#d4c6ff] rounded-full opacity-15 animate-pulse animation-delay-1200"></div>
      
      {/* Mystical runes and symbols - moved to top and bottom only */}
      <div className="absolute top-8 left-1/4 text-[#624cab] opacity-4 text-2xl">⚔️</div>
      <div className="absolute bottom-8 right-1/3 text-[#a48fff] opacity-3 text-xl">🏰</div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-[#624cab] opacity-12"></div>
      <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-[#624cab] opacity-12"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-[#624cab] opacity-12"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-[#624cab] opacity-12"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#d4c6ff] mb-2 drop-shadow-lg">
            Вітаємо назад!
          </h1>
          <p className="text-xl text-gray-300">
            Увійдіть у світ епічних пригод
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
} 