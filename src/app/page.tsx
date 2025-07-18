import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error('Session error:', error)
    // Continue without session
  }

  return (
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
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-green-400 mb-2">
                  Вітаємо, {session.user.heroName || session.user.name}!
                </h2>
                <p className="text-gray-300 mb-4">
                  Рівень: {session.user.heroLevel} | Клас: {session.user.heroClass || 'Новичок'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link 
                    href="/quests/my"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Мої Квести
                  </Link>
                  <Link 
                    href="/heroes"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Знайти Героїв
                  </Link>
                  <Link 
                    href="/quests/create"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Створити Квест
                  </Link>
                  <Link 
                    href="/quests/create?assignTo=self"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Увійти
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Створити Героя
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 bg-opacity-30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Створюй Квести</h3>
            <p className="text-gray-300">
              Перетвори будь-яку справу на епічну місію з нагородами та досвідом
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Знаходь Героїв</h3>
            <p className="text-gray-300">
              Додавай друзів та делегуй квести тим, хто може їх виконати
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Заробляй Нагороди</h3>
            <p className="text-gray-300">
              Отримуй золото, досвід та підвищуй свій рівень героя
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
