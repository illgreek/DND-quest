'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navigation() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-gray-900 bg-opacity-80 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚔️</span>
            <span className="text-xl font-bold text-yellow-400">DND Quests</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                <Link 
                  href="/quests/my"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Мої Квести
                </Link>
                <Link 
                  href="/heroes"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Знайти Героїв
                </Link>
                <Link 
                  href="/quests/create"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Створити Квест
                </Link>
                <Link 
                  href="/quests/create?assignTo=self"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Квест для Себе
                </Link>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors">
                    <span className="text-sm">
                      {session.user.heroName || session.user.name}
                    </span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      Lvl {session.user.heroLevel}
                    </span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link 
                        href="/profile"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                      >
                        Профіль
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                      >
                        Вийти
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Увійти
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Створити Героя
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-yellow-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            {session ? (
              <div className="space-y-2">
                <Link 
                  href="/quests/my"
                  className="block text-gray-300 hover:text-yellow-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Мої Квести
                </Link>
                <Link 
                  href="/heroes"
                  className="block text-gray-300 hover:text-yellow-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Знайти Героїв
                </Link>
                <Link 
                  href="/quests/create"
                  className="block text-gray-300 hover:text-yellow-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Створити Квест
                </Link>
                <Link 
                  href="/quests/create?assignTo=self"
                  className="block text-gray-300 hover:text-yellow-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Квест для Себе
                </Link>
                <Link 
                  href="/profile"
                  className="block text-gray-300 hover:text-yellow-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профіль
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-300 hover:text-yellow-400 py-2"
                >
                  Вийти
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/auth/signin"
                  className="block text-gray-300 hover:text-yellow-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Увійти
                </Link>
                <Link 
                  href="/auth/signup"
                  className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Створити Героя
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
} 