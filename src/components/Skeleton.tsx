import React from 'react'

interface PreloaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Preloader({ className = "", size = 'md' }: PreloaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Sword animation */}
        <div className="absolute inset-0 animate-spin">
          <div className="w-full h-full border-4 border-transparent border-t-yellow-400 border-r-blue-400 rounded-full"></div>
        </div>
        {/* Shield in center */}
        <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-yellow-400 text-xs font-bold">⚔️</span>
        </div>
      </div>
    </div>
  )
}

export function QuestPreloader() {
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="h-4 bg-gray-700 rounded mb-2 animate-pulse"></div>
      <div className="h-4 w-5/6 bg-gray-700 rounded mb-4 animate-pulse"></div>
      <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
    </div>
  )
}

export function HeroPreloader() {
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-6 w-3/4 bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="h-6 w-8 mx-auto mb-1 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-3 w-12 mx-auto bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="text-center">
          <div className="h-6 w-8 mx-auto mb-1 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-3 w-12 mx-auto bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
    </div>
  )
}

export function PagePreloader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Preloader size="lg" className="mb-4" />
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">
            Завантаження пригод...
          </h2>
          <p className="text-gray-300">
            Готуємо світ для твоїх героїв
          </p>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export function AuthPreloader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 max-w-md w-full text-center">
        <Preloader size="lg" className="mb-6" />
        <h2 className="text-xl font-bold text-yellow-400 mb-2">
          Підготовка героя...
        </h2>
        <p className="text-gray-300">
          Створюємо твій профіль
        </p>
      </div>
    </div>
  )
}

// Legacy exports for backward compatibility
export function Skeleton({ className = "" }: { className?: string }) {
  return <Preloader className={className} />
}

export function QuestSkeleton() {
  return <QuestPreloader />
}

export function HeroSkeleton() {
  return <HeroPreloader />
}

export function PageSkeleton() {
  return <PagePreloader />
}

export function AuthSkeleton() {
  return <AuthPreloader />
}

// Grid preloaders for multiple items
export function HeroGridPreloader() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <HeroPreloader />
      <HeroPreloader />
      <HeroPreloader />
      <HeroPreloader />
      <HeroPreloader />
      <HeroPreloader />
    </div>
  )
}

export function QuestGridPreloader() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <QuestPreloader />
      <QuestPreloader />
      <QuestPreloader />
      <QuestPreloader />
      <QuestPreloader />
      <QuestPreloader />
    </div>
  )
} 