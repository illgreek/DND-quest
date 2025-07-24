'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { getHeroClassLabel, getHeroClassEmoji, heroClasses } from '@/lib/heroClasses'
import ThemeToggle from '@/components/ThemeToggle'
import { getCurrentLevel, getNextLevel, getLevelProgress } from '@/lib/heroLevels'
import { UserIcon, SwordIcon, CoinsIcon, SparklesIcon, TrophyIcon, StarIcon, ShieldIcon, ZapIcon, ScrollIcon, ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  totalQuests: number
  completedQuests: number
  failedQuests: number
  totalGold: number
  totalExperience: number
  averageDifficulty: string
}

export default function Profile() {
  const { data: session, status, update } = useSession()
  const pathname = usePathname()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  // Слухаємо події оновлення сесії
  useEffect(() => {
    const handleSessionUpdate = async () => {
      await update()
      // Оновлюємо статистику після оновлення сесії
      if (session) {
        fetchStats()
      }
    }

    window.addEventListener('session-updated', handleSessionUpdate)
    return () => window.removeEventListener('session-updated', handleSessionUpdate)
  }, [update, session])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Помилка завантаження статистики')
      }
    } catch (err) {
      setError('Помилка завантаження статистики')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-4 border-transparent border-t-theme-accent border-r-theme-primary rounded-full"></div>
            </div>
            <div className="absolute inset-2 bg-theme-surface rounded-full flex items-center justify-center">
              <span className="text-theme-accent text-xs font-bold">⚔️</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
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
    // Якщо користувач вже на сторінці входу, не показуємо повідомлення про доступ
    if (pathname.startsWith('/auth/')) {
      return null
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-400 mb-4">Доступ заборонено</h1>
          <p className="text-gray-300 mb-4">Потрібно увійти для перегляду профілю</p>
          <Link 
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-gradient-theme text-gray-100 hover:bg-gradient-theme-hover border border-theme-primary shadow-lg rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2">⚔️</span>
            Увійти в систему
          </Link>
        </div>
      </div>
    )
  }

  const heroClass = heroClasses[session.user.heroClass as keyof typeof heroClasses]
  const currentLevel = getCurrentLevel(session.user.heroClass || 'Warrior', session.user.experience || 0)
  const nextLevel = getNextLevel(session.user.heroClass || 'Warrior', session.user.experience || 0)
  const progress = getLevelProgress(session.user.heroClass || 'Warrior', session.user.experience || 0)

  return (
          <div className="min-h-screen bg-theme-background text-gray-100 relative overflow-hidden pb-20 lg:pb-0">
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Link 
                href="/"
                className="mr-4 p-2 rounded-lg bg-theme-surface border border-theme-border hover:border-theme-primary transition-colors"
              >
                <ArrowLeftIcon size={20} className="text-theme-accent" />
              </Link>
              <h1 className="text-4xl font-bold text-gray-100 drop-shadow-lg lg:bg-transparent bg-theme-surface lg:bg-opacity-0 bg-opacity-90 px-4 py-2 rounded-lg">
                Профіль Героя
              </h1>
              <div className="ml-2 text-3xl text-theme-accent opacity-80">⚔️</div>
            </div>
            <p className="text-xl text-gray-300 lg:bg-transparent bg-theme-surface lg:bg-opacity-0 bg-opacity-90 px-4 py-2 rounded-lg">
              Твої досягнення та статистика
            </p>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 border border-red-500">
              {error}
            </div>
          )}

          {/* Hero Profile Card */}
          <div className="relative mb-8 rounded-xl overflow-hidden transform transition-all duration-300">
            {/* Decorative border with magical effect */}
            <div className="absolute inset-0 bg-gradient-theme p-[2px] rounded-xl overflow-hidden">
              {/* Top-right corner decoration */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-theme-accent flex items-center justify-center rounded-bl-xl border-b border-l border-theme-primary">
                <SparklesIcon size={12} className="text-theme-accent" />
              </div>
              {/* Top-left corner decoration */}
              <div className="absolute top-0 left-0 w-8 h-8 bg-theme-accent flex items-center justify-center rounded-br-xl border-b border-r border-theme-primary">
                <div className="w-2 h-2 bg-theme-accent rounded-full opacity-60"></div>
              </div>
              {/* Bottom-right corner decoration */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-theme-accent flex items-center justify-center rounded-tl-xl border-t border-l border-theme-primary">
                <div className="w-2 h-2 bg-theme-accent rounded-full opacity-60"></div>
              </div>
              {/* Bottom-left corner decoration */}
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-theme-accent flex items-center justify-center rounded-tr-xl border-t border-r border-theme-primary">
                <div className="w-2 h-2 bg-theme-accent rounded-full opacity-60"></div>
              </div>
              
              {/* Magical sparkles */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-200"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-400"></div>
            </div>
            
            {/* Card content */}
            <div className="bg-theme-surface p-8 rounded-xl relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Hero Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-theme-primary bg-theme-accent flex items-center justify-center relative">
                    <span className="text-6xl">{getHeroClassEmoji(session.user.heroClass || '')}</span>
                    {/* Avatar glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-theme-primary/20 to-theme-accent/20 animate-pulse"></div>
                  </div>
                </div>

                {/* Hero Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-100 mb-2">
                    {session.user.heroName || session.user.name}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <span className="text-theme-accent font-bold">
                      Рівень {session.user.heroLevel}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-theme-accent font-bold">
                      {getHeroClassLabel(session.user.heroClass || '')}
                    </span>
                  </div>
                  
                  {/* Hero Title */}
                  <div className="text-center md:text-left mb-4">
                    <span className="text-lg text-gray-100 font-medium">
                      {currentLevel.title}
                    </span>
                  </div>

                  {/* XP Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-theme-accent">Прогрес до наступного рівня</span>
                      <span className="text-gray-400">{session.user.experience || 0} / {nextLevel ? nextLevel.experienceRequired : currentLevel.experienceRequired} XP</span>
                    </div>
                    <div className="w-full bg-theme-background rounded-full h-3 overflow-hidden border border-theme-border">
                      <div 
                        className="bg-gradient-theme h-full rounded-full transition-all duration-500 shadow-lg" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Hero Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-theme-background rounded-lg p-3 border border-theme-border">
                      <div className="text-2xl text-yellow-400 font-bold">{session.user.gold || 0}</div>
                      <div className="text-sm text-gray-400">🪙 Золото</div>
                    </div>
                    <div className="text-center bg-theme-background rounded-lg p-3 border border-theme-border">
                      <div className="text-2xl text-blue-400 font-bold">{session.user.experience || 0}</div>
                      <div className="text-sm text-gray-400">⭐ Досвід</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 animate-spin">
                  <div className="w-full h-full border-4 border-transparent border-t-theme-accent border-r-theme-primary rounded-full"></div>
                </div>
                <div className="absolute inset-2 bg-theme-surface rounded-full flex items-center justify-center">
                  <span className="text-theme-accent text-xs font-bold">⚔️</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-100 mb-2">
                Завантаження статистики...
              </h2>
              <p className="text-gray-300">
                Аналізуємо твої досягнення
              </p>
            </div>
          ) : stats ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Quests */}
              <div className="relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-theme p-[2px] rounded-xl overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                </div>
                <div className="bg-theme-surface p-6 rounded-xl relative z-10 text-center">
                  <div className="text-3xl mb-2">
                    <ScrollIcon className="text-theme-accent mx-auto" size={32} />
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {stats.totalQuests}
                  </div>
                  <div className="text-sm text-gray-400">
                    Всього квестів
                  </div>
                </div>
              </div>

              {/* Completed Quests */}
              <div className="relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-theme p-[2px] rounded-xl overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                </div>
                <div className="bg-theme-surface p-6 rounded-xl relative z-10 text-center">
                  <div className="text-3xl mb-2">
                    <TrophyIcon className="text-emerald-400 mx-auto" size={32} />
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {stats.completedQuests}
                  </div>
                  <div className="text-sm text-gray-400">
                    Завершено
                  </div>
                </div>
              </div>

              {/* Success Rate */}
              <div className="relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-theme p-[2px] rounded-xl overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                </div>
                <div className="bg-theme-surface p-6 rounded-xl relative z-10 text-center">
                  <div className="text-3xl mb-2">
                    <StarIcon className="text-yellow-400 mx-auto" size={32} />
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {stats.totalQuests > 0 ? Math.round((stats.completedQuests / stats.totalQuests) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-400">
                    Успішність
                  </div>
                </div>
              </div>

              {/* Average Difficulty */}
              <div className="relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-theme p-[2px] rounded-xl overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                </div>
                <div className="bg-theme-surface p-6 rounded-xl relative z-10 text-center">
                  <div className="text-3xl mb-2">
                    <SwordIcon className="text-red-400 mx-auto" size={32} />
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {stats.averageDifficulty || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Середня складність
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-xl mb-4">
                Статистика недоступна
              </div>
              <p className="text-gray-500">
                Почни виконувати квести, щоб побачити свою статистику
              </p>
            </div>
          )}

          {/* Hero Class Details */}
          {heroClass && (
            <div className="relative mt-8 rounded-xl overflow-hidden transform transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-theme p-[2px] rounded-xl overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute top-2 left-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-400"></div>
              </div>
              <div className="bg-theme-surface p-6 rounded-xl relative z-10">
                <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                  <ShieldIcon size={20} className="mr-2" />
                  Інформація про клас
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-theme-accent mb-2">
                      {heroClass.label} {heroClass.emoji}
                    </h4>
                    <p className="text-gray-300">
                      Твій герой належить до класу {heroClass.label.toLowerCase()}. 
                      Кожен клас має свої унікальні здібності та стиль гри.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl mb-2">
                      {heroClass.emoji}
                    </div>
                    <div className="text-sm text-gray-400">
                      Клас героя
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="mt-8">
            <ThemeToggle />
          </div>

          {/* Achievements Placeholder */}
          <div className="relative mt-8 rounded-xl overflow-hidden transform transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-theme p-[2px] rounded-xl overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-200"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-400"></div>
            </div>
            <div className="bg-theme-surface p-6 rounded-xl relative z-10">
              <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                <ZapIcon size={20} className="mr-2" />
                Досягнення
              </h3>
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">
                  Система досягнень скоро з'явиться!
                </div>
                <p className="text-gray-500">
                  Виконуй квести та отримуй унікальні нагороди
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 