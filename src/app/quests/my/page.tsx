'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getHeroClassLabel, heroClasses } from '@/lib/heroClasses'
import { getCurrentLevel } from '@/lib/heroLevels'


interface Quest {
  id: string
  title: string
  description: string
  reward: number
  experience: number
  difficulty: string
  category: string
  status: string
  location?: string
  dueDate?: string
  isUrgent: boolean
  createdAt: string
  creator?: {
    id: string
    name?: string
    heroName?: string
    heroClass?: string
    experience?: number
  }
  receiver?: {
    id: string
    name?: string
    heroName?: string
    heroClass?: string
    experience?: number
  }
}

export default function MyQuests() {
  const { data: session, status } = useSession()
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)

  const difficulties = {
    EASY: { label: 'Легкий', emoji: '🟢', color: 'text-green-400' },
    MEDIUM: { label: 'Середній', emoji: '🟡', color: 'text-yellow-400' },
    HARD: { label: 'Важкий', emoji: '🟠', color: 'text-orange-400' },
    EPIC: { label: 'Епічний', emoji: '🔴', color: 'text-red-400' }
  }

  const categories = {
    SHOPPING: { label: 'Покупки', emoji: '🛒' },
    CHORES: { label: 'Побутові справи', emoji: '🧹' },
    WORK: { label: 'Робота', emoji: '💼' },
    PERSONAL: { label: 'Особисте', emoji: '👤' },
    HEALTH: { label: 'Здоров\'я', emoji: '💊' },
    STUDY: { label: 'Навчання', emoji: '📚' },
    GENERAL: { label: 'Загальне', emoji: '📋' }
  }

  const statuses = {
    OPEN: { label: 'Відкритий', emoji: '🔓', color: 'text-blue-400' },
    IN_PROGRESS: { label: 'Виконується', emoji: '⚡', color: 'text-yellow-400' },
    COMPLETED: { label: 'Завершено', emoji: '✅', color: 'text-green-400' },
    FAILED: { label: 'Провалено', emoji: '❌', color: 'text-red-400' },
    CANCELLED: { label: 'Відкликано', emoji: '🚫', color: 'text-gray-400' }
  }



  useEffect(() => {
    fetchQuests()
  }, [activeTab])

  const fetchQuests = async () => {
    try {
      setLoading(true)
      // Перетворюємо значення activeTab у правильні параметри для API
      let apiType = 'all'
      if (activeTab === 'assigned') {
        apiType = 'assigned_to_me'
      } else if (activeTab === 'created') {
        apiType = 'created_by_me'
      }
      
      const response = await fetch(`/api/quests?type=${apiType}`)
      
      if (response.ok) {
        const data = await response.json()
        setQuests(data)
      } else {
        setError('Помилка завантаження квестів')
      }
    } catch (err) {
      setError('Помилка завантаження квестів')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuest = async (questId: string) => {
    try {
      const response = await fetch(`/api/quests/${questId}/accept`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchQuests()
        setSuccess('Квест успішно прийнято! Тепер ви можете його виконати.')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError('Помилка прийняття квесту')
    }
  }

  const handleCompleteQuest = async (questId: string) => {
    try {
      const response = await fetch(`/api/quests/${questId}/complete`, {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Quest completion result:', result)
        
        fetchQuests()
        setShowCompleteModal(false)
        setSelectedQuest(null)
        
        // Оновлюємо дані без перезавантаження сторінки
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        
        // Show success message
        let message = `Квест успішно здано! Отримано: ${result.rewards.gold} 🪙 золота та ${result.rewards.experience} ⭐ досвіду`
        if (result.rewards.levelUp) {
          message += `\n🎉 Вітаємо! Ви підвищилися до рівня ${result.user.heroLevel}!`
        }
        setSuccess(message)
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000)
      }
    } catch (err) {
      setError('Помилка завершення квесту')
    }
  }

  const handleCancelQuest = async (questId: string) => {
    try {
      const response = await fetch(`/api/quests/${questId}/cancel`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchQuests()
        setSuccess('Квест успішно відкликано!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Помилка відкликання квесту')
      }
    } catch (err) {
      setError('Помилка відкликання квесту')
    }
  }

  const openCompleteModal = (quest: Quest) => {
    setSelectedQuest(quest)
    setShowCompleteModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Функція для визначення, чи може користувач прийняти квест
  const canAcceptQuest = (quest: Quest) => {
    return quest.status === 'OPEN' && 
           quest.receiver?.id === session?.user.id && 
           quest.creator?.id !== session?.user.id
  }

  // Функція для визначення, чи може користувач здати квест
  const canCompleteQuest = (quest: Quest) => {
    return quest.status === 'IN_PROGRESS' && 
           quest.receiver?.id === session?.user.id
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
          <p className="text-gray-300 mb-4">Потрібно увійти для перегляду квестів</p>
          <Link href="/auth/signin" className="text-yellow-400 hover:text-yellow-300">
            Увійти
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Мої Квести
          </h1>
          <p className="text-gray-300">
            Керуй своїми епічними місіями!
          </p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Всі Квести
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'assigned'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Квести Мені
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'created'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Квести від Мене
          </button>
        </div>

        {/* Create Button */}
        <div className="text-center mb-6">
          <Link
            href="/quests/create"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <span>⚔️</span>
            Створити Новий Квест
          </Link>
        </div>

        {/* Quests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 animate-spin">
                <div className="w-full h-full border-4 border-transparent border-t-yellow-400 border-r-blue-400 rounded-full"></div>
              </div>
              <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 text-xs font-bold">⚔️</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-yellow-400 mb-2">
              Завантаження квестів...
            </h2>
            <p className="text-gray-300">
              Знаходимо твої епічні місії
            </p>
          </div>
        ) : quests.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-xl">
              У вас поки немає квестів
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quests.map((quest) => {
              const heroClass = heroClasses[quest.creator?.heroClass as keyof typeof heroClasses]
              const receiverClass = quest.receiver ? heroClasses[quest.receiver.heroClass as keyof typeof heroClasses] : null
              const creatorLevel = quest.creator?.heroClass ? getCurrentLevel(quest.creator.heroClass, quest.creator.experience || 0) : null

              return (
                <div key={quest.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                  {/* Quest Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {quest.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {heroClass?.emoji} {heroClass?.label}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-sm text-gray-400">
                          {creatorLevel ? creatorLevel.title : 'Рівень 1'}
                        </span>
                        {activeTab === 'assigned' && quest.creator && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-400">
                              Створив: {quest.creator.heroName || quest.creator.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quest Description */}
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {quest.description}
                  </p>

                  {/* Quest Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>🎯</span>
                      <span>Складність: {difficulties[quest.difficulty as keyof typeof difficulties]?.emoji} {difficulties[quest.difficulty as keyof typeof difficulties]?.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>⏰</span>
                      <span>Дедлайн: {quest.dueDate ? new Date(quest.dueDate).toLocaleDateString('uk-UA') : 'Немає'}</span>
                    </div>
                    {quest.receiver && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>👤</span>
                        <span>
                          {quest.receiver.id === session.user.id ? (
                            'Доручено: вам'
                          ) : (
                            `Доручено: ${receiverClass?.emoji} ${quest.receiver?.heroName || quest.receiver?.name}`
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quest Status */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      quest.status === 'OPEN' ? 'bg-blue-600 text-blue-100' :
                      quest.status === 'IN_PROGRESS' ? 'bg-yellow-600 text-yellow-100' :
                      quest.status === 'COMPLETED' ? 'bg-green-600 text-green-100' :
                      quest.status === 'FAILED' ? 'bg-red-600 text-red-100' :
                      quest.status === 'CANCELLED' ? 'bg-gray-600 text-gray-100' :
                      'bg-gray-600 text-gray-100'
                    }`}>
                      {quest.status === 'OPEN' ? '🔓 Відкритий' :
                       quest.status === 'IN_PROGRESS' ? '⚡ Виконується' :
                       quest.status === 'COMPLETED' ? '✅ Завершено' :
                       quest.status === 'FAILED' ? '❌ Провалено' :
                       quest.status === 'CANCELLED' ? '🚫 Відкликано' :
                       '❓ Невідомо'}
                    </span>
                  </div>

                  {/* Quest Rewards */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold">{quest.reward}</div>
                        <div className="text-xs text-gray-400">🪙 Золото</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">{quest.experience}</div>
                        <div className="text-xs text-gray-400">⭐ Досвід</div>
                      </div>
                    </div>
                  </div>

                  {/* Quest Actions */}
                  {quest.status === 'OPEN' && quest.receiver?.id === session.user.id && quest.creator?.id !== session.user.id && (
                    <button
                      onClick={() => handleAcceptQuest(quest.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors mb-2"
                    >
                      Прийняти Квест
                    </button>
                  )}

                  {/* Кнопка для квестів, призначених собі */}
                  {quest.status === 'OPEN' && quest.receiver?.id === session.user.id && quest.creator?.id === session.user.id && (
                    <button
                      onClick={() => handleAcceptQuest(quest.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors mb-2"
                    >
                      Почати Виконання
                    </button>
                  )}

                  {/* Кнопка здачі для квестів в процесі виконання (включаючи створені для себе) */}
                  {quest.status === 'IN_PROGRESS' && quest.receiver?.id === session.user.id && (
                    <button
                      onClick={() => openCompleteModal(quest)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors mb-2"
                    >
                      Завершити Квест
                    </button>
                  )}

                  {/* Показуємо інформацію для квестів, створених користувачем */}
                  {quest.creator?.id === session.user.id && quest.status === 'OPEN' && !quest.receiver && (
                    <div className="text-center text-gray-400 text-sm mb-2">
                      Квест очікує призначення
                    </div>
                  )}

                  {/* Показуємо інформацію для квестів, призначених собі */}
                  {quest.creator?.id === session.user.id && quest.status === 'OPEN' && quest.receiver?.id === session.user.id && (
                    <div className="text-center text-green-400 text-sm mb-2">
                      ✅ Призначено вам
                    </div>
                  )}

                  {/* Показуємо інформацію для квестів, створених для себе і в процесі виконання */}
                  {quest.creator?.id === session.user.id && quest.status === 'IN_PROGRESS' && quest.receiver?.id === session.user.id && (
                    <div className="text-center text-blue-400 text-sm mb-2">
                      ⚡ Виконується вами
                    </div>
                  )}

                  {/* Кнопка відкликання для квестів, створених користувачем (тільки якщо призначено другу) */}
                  {quest.creator?.id === session.user.id && quest.status === 'OPEN' && quest.receiver && quest.receiver.id !== session.user.id && (
                    <button
                      onClick={() => handleCancelQuest(quest.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors mb-2"
                    >
                      Відкликати Квест
                    </button>
                  )}

                  {/* Показуємо повідомлення для відкликаних квестів */}
                  {quest.status === 'CANCELLED' && (
                    <div className="text-center text-gray-400 text-sm mb-2">
                      Квест було відкликано
                    </div>
                  )}

                  <div className="text-xs text-gray-500 text-center">
                    Створено {new Date(quest.createdAt).toLocaleDateString('uk-UA')}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Complete Quest Modal */}
        {showCompleteModal && selectedQuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">
                Завершити Квест
              </h3>
              <p className="text-gray-300 mb-6">
                Ви впевнені, що хочете завершити квест "{selectedQuest.title}"?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleCompleteQuest(selectedQuest.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Завершити
                </button>
                <button
                  onClick={() => {
                    setShowCompleteModal(false)
                    setSelectedQuest(null)
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-md">
            <div className="whitespace-pre-line">{success}</div>
          </div>
        )}
      </div>
    </div>
  )
} 