'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { heroClasses } from '@/lib/heroClasses'
import { getCurrentLevel, getNextLevel, getLevelProgress } from '@/lib/heroLevels'

interface UserStats {
  totalQuests: number
  completedQuests: number
  totalGold: number
  totalExperience: number
  friendsCount: number
}

export default function Profile() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchUserStats()
    }
  }, [session])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/profile/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-4 border-transparent border-t-yellow-400 border-r-blue-400 rounded-full"></div>
            </div>
            <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xs font-bold">⚔️</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">
            Завантаження пригод...
          </h2>
          <p className="text-gray-300">
            Готуємо світ для твоїх героїв
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-400 mb-4">Доступ заборонено</h1>
          <p className="text-gray-300 mb-4">Потрібно увійти для перегляду профілю</p>
          <Link href="/auth/signin" className="text-yellow-400 hover:text-yellow-300">
            Увійти
          </Link>
        </div>
      </div>
    )
  }

  const heroClass = heroClasses[session.user.heroClass as keyof typeof heroClasses]
  const currentLevel = getCurrentLevel(session.user.heroClass || 'Warrior', stats?.totalExperience || 0)
  const nextLevel = getNextLevel(session.user.heroClass || 'Warrior', stats?.totalExperience || 0)
  const levelProgress = getLevelProgress(session.user.heroClass || 'Warrior', stats?.totalExperience || 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Header */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="text-6xl">
              {heroClass?.emoji || '👤'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {session.user.heroName || session.user.name}
              </h1>
              <div className="text-lg text-gray-300 mb-2">
                {heroClass?.label} • {currentLevel.title}
              </div>
              <div className="text-sm text-gray-400">
                {currentLevel.description}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl text-yellow-400 font-bold">
                {currentLevel.level}
              </div>
              <div className="text-sm text-gray-400">Рівень</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="h-8 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="h-8 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="h-8 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="h-8 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="h-8 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="text-3xl text-blue-400 font-bold mb-2">
                {stats?.totalQuests || 0}
              </div>
              <div className="text-gray-300">Всього квестів</div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="text-3xl text-green-400 font-bold mb-2">
                {stats?.completedQuests || 0}
              </div>
              <div className="text-gray-300">Завершено</div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="text-3xl text-yellow-400 font-bold mb-2">
                {stats?.totalGold || 0}
              </div>
              <div className="text-gray-300">🪙 Золото</div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="text-3xl text-purple-400 font-bold mb-2">
                {stats?.totalExperience || 0}
              </div>
              <div className="text-gray-300">⭐ Досвід</div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center">
              <div className="text-3xl text-orange-400 font-bold mb-2">
                {stats?.friendsCount || 0}
              </div>
              <div className="text-gray-300">Друзів</div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Прогрес до наступного рівня</h3>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ 
                width: `${levelProgress}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{currentLevel.title}</span>
            {nextLevel ? (
              <span>{stats?.totalExperience || 0} / {nextLevel.experienceRequired} досвіду</span>
            ) : (
              <span>Максимальний рівень досягнуто!</span>
            )}
          </div>
          {nextLevel && (
            <div className="text-xs text-gray-500 mt-2">
              Наступний рівень: {nextLevel.title}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/quests/create"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
          >
            <div className="text-2xl mb-2">⚔️</div>
            <div>Створити Квест</div>
          </Link>
          

          
          <Link
            href="/quests/my"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div>Мої Квести</div>
          </Link>
          
          <Link
            href="/heroes"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <div>Знайти Героїв</div>
          </Link>
        </div>

        {/* Achievements Section */}
        <div className="mt-8 bg-gray-800 bg-opacity-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Досягнення</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <div className="text-2xl">🎯</div>
              <div>
                <div className="font-bold text-white">Перший квест</div>
                <div className="text-sm text-gray-400">Створіть свій перший квест</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <div className="text-2xl">🤝</div>
              <div>
                <div className="font-bold text-white">Команда</div>
                <div className="text-sm text-gray-400">Знайдіть першого друга</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="font-bold text-white">Виконавець</div>
                <div className="text-sm text-gray-400">Завершіть 5 квестів</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <div className="text-2xl">⭐</div>
              <div>
                <div className="font-bold text-white">Досвід</div>
                <div className="text-sm text-gray-400">Досягніть 5 рівня</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 