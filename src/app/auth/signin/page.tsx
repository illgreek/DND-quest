'use client'

import SignInForm from './SignInForm'

export default function SignIn() {
  return (
    <div className="min-h-screen bg-theme-background text-gray-100 relative overflow-hidden flex items-center justify-center pb-20 lg:pb-0">
      {/* Background decorative elements */}
      {/* Floating magical orbs */}
      <div className="absolute top-32 left-8 w-2 h-2 bg-theme-primary rounded-full opacity-15 animate-pulse animation-delay-1000"></div>
      <div className="absolute top-16 right-12 w-1 h-1 bg-theme-accent rounded-full opacity-20 animate-pulse animation-delay-1500"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-theme-accent rounded-full opacity-10 animate-pulse animation-delay-800"></div>
      <div className="absolute bottom-16 right-8 w-1 h-1 bg-theme-text rounded-full opacity-15 animate-pulse animation-delay-1200"></div>
      
      {/* Mystical runes and symbols - moved to top and bottom only */}
      <div className="absolute top-8 left-1/4 text-theme-primary opacity-4 text-2xl">⚔️</div>
      <div className="absolute bottom-8 right-1/3 text-theme-accent opacity-3 text-xl">🏰</div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-grid-theme"></div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-grid-theme"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-grid-theme"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-grid-theme"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-grid-theme"></div>
        
        <div className="absolute top-0 left-0 w-px h-full bg-grid-theme"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-grid-theme"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-grid-theme"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-grid-theme"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-grid-theme"></div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-theme-primary opacity-12"></div>
      <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-theme-primary opacity-12"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-theme-primary opacity-12"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-theme-primary opacity-12"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2 drop-shadow-lg lg:bg-transparent bg-theme-surface lg:bg-opacity-0 bg-opacity-90 px-4 py-2 rounded-lg">
            Вітаємо назад!
          </h1>
          <p className="text-xl text-gray-300 lg:bg-transparent bg-theme-surface lg:bg-opacity-0 bg-opacity-90 px-4 py-2 rounded-lg">
            Увійдіть у світ епічних пригод
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
} 