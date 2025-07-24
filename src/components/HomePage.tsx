'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import TutorialModal from './TutorialModal'
import { getHeroClassLabel, getHeroClassEmoji } from '@/lib/heroClasses'
import { SwordIcon, UsersIcon, TrophyIcon, SparklesIcon } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !session.user.hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-4 border-transparent border-t-[#a48fff] border-r-[#624cab] rounded-full"></div>
            </div>
            <div className="absolute inset-2 bg-[#252838] rounded-full flex items-center justify-center">
              <span className="text-[#a48fff] text-xs font-bold">⚔️</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#d4c6ff] mb-2">
            Завантаження пригод...
          </h2>
          <p className="text-gray-300">
            Готуємо світ для твоїх героїв
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-[#d4c6ff] mb-6 drop-shadow-lg">
              DND Quests
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Перетвори свої щоденні справи на епічні квести! 
              Створюй завдання, знаходь героїв та виконуй місії разом з друзями.
            </p>
            
            {session ? (
              <div className="space-y-4">
                <div className="card-magical-border">
                  <div className="card-magical-content p-6 max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-[#d4c6ff] mb-3 text-center">
                      Вітаємо, {session.user.heroName || session.user.name}! ⚔️
                    </h2>
                    <p className="text-gray-300 mb-6 text-center text-lg">
                      Рівень: <span className="text-[#a48fff] font-bold">{session.user.heroLevel}</span> | 
                      Клас: <span className="text-[#a48fff] font-bold">{getHeroClassLabel(session.user.heroClass || '') || 'Новичок'}</span>
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <Link 
                        href="/quests/my"
                        className="btn-danger text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center text-sm"
                      >
                        Мої Квести
                      </Link>
                      <Link 
                        href="/heroes"
                        className="btn-primary text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center text-sm"
                      >
                        Знайти Героїв
                      </Link>
                      <Link 
                        href="/quests/create"
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center text-sm border border-emerald-500"
                      >
                        Створити Квест
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/auth/signin"
                    className="btn-primary text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Увійти ⚔️
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border border-emerald-500"
                  >
                    Створити Героя 🛡️
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="card-magical-border">
              <div className="card-magical-content p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-5xl mb-6">⚔️</div>
                <h3 className="text-xl font-bold text-[#d4c6ff] mb-4">Створюй Квести</h3>
                <p className="text-gray-300 leading-relaxed">
                  Перетвори будь-яку справу на епічну місію з нагородами та досвідом
                </p>
              </div>
            </div>
            
            <div className="card-magical-border">
              <div className="card-magical-content p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-5xl mb-6">👥</div>
                <h3 className="text-xl font-bold text-[#d4c6ff] mb-4">Знаходь Героїв</h3>
                <p className="text-gray-300 leading-relaxed">
                  Додавай друзів та делегуй квести тим, хто може їх виконати
                </p>
              </div>
            </div>
            
            <div className="card-magical-border">
              <div className="card-magical-content p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-5xl mb-6">🏆</div>
                <h3 className="text-xl font-bold text-[#d4c6ff] mb-4">Заробляй Нагороди</h3>
                <p className="text-gray-300 leading-relaxed">
                  Отримуй золото, досвід та підвищуй свій рівень героя
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TutorialModal 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </>
  )
} 