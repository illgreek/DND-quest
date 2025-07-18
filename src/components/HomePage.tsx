'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import TutorialModal from './TutorialModal'

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-yellow-400 mb-6 drop-shadow-lg">
              DND Quests
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Перетвори свої щоденні справи на епічні квести! 
              Створюй завдання, знаходь героїв та виконуй місії разом з друзями.
            </p>
            
            {session ? (
              <div className="space-y-4">
                <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-6 max-w-lg mx-auto border border-gray-700 shadow-2xl">
                  <h2 className="text-2xl font-bold text-green-400 mb-3 text-center">
                    Вітаємо, {session.user.heroName || session.user.name}! ⚔️
                  </h2>
                  <p className="text-gray-300 mb-6 text-center text-lg">
                    Рівень: <span className="text-yellow-400 font-bold">{session.user.heroLevel}</span> | 
                    Клас: <span className="text-blue-400 font-bold">{session.user.heroClass || 'Новичок'}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      href="/quests/my"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center text-sm"
                    >
                      Мої Квести
                    </Link>
                    <Link 
                      href="/heroes"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center text-sm"
                    >
                      Знайти Героїв
                    </Link>
                    <Link 
                      href="/quests/create"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center text-sm"
                    >
                      Створити Квест
                    </Link>
                    <Link 
                      href="/quests/create?assignTo=self"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center text-sm"
                    >
                      Квест для Себе
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/auth/signin"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Увійти ⚔️
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Створити Героя 🛡️
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6">⚔️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Створюй Квести</h3>
              <p className="text-gray-300 leading-relaxed">
                Перетвори будь-яку справу на епічну місію з нагородами та досвідом
              </p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6">👥</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Знаходь Героїв</h3>
              <p className="text-gray-300 leading-relaxed">
                Додавай друзів та делегуй квести тим, хто може їх виконати
              </p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6">🏆</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Заробляй Нагороди</h3>
              <p className="text-gray-300 leading-relaxed">
                Отримуй золото, досвід та підвищуй свій рівень героя
              </p>
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