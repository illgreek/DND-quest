'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

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
  }
  receiver?: {
    id: string
    name?: string
    heroName?: string
    heroClass?: string
  }
}

export default function MyQuests() {
  const { data: session } = useSession()
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
    FAILED: { label: 'Провалено', emoji: '❌', color: 'text-red-400' }
  }

  useEffect(() => {
    fetchQuests()
  }, [activeTab])

  const fetchQuests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quests?type=${activeTab}`)
      
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
        fetchQuests()
        setShowCompleteModal(false)
        setSelectedQuest(null)
        
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

        {success && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 whitespace-pre-line">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Всі Квести
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'created'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Створені Мною
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'accepted'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Прийняті Мною
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'available'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Доступні Квести
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'assigned'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Призначені Мені
          </button>
        </div>

        {/* Create Quest Button */}
        <div className="text-center mb-6">
          <Link
            href="/quests/create"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span>⚔️</span>
            Створити Новий Квест
          </Link>
        </div>

        {/* Quests List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-yellow-400 text-xl">Завантаження квестів...</div>
          </div>
        ) : quests.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-xl mb-4">
              {activeTab === 'all' && 'У вас поки немає квестів'}
              {activeTab === 'created' && 'Ви ще не створили квестів'}
              {activeTab === 'accepted' && 'Ви ще не прийняли квестів'}
              {activeTab === 'available' && 'Немає доступних квестів'}
              {activeTab === 'assigned' && 'Вам поки не призначили квестів'}
            </div>
            {activeTab === 'available' && (
              <Link
                href="/quests/create"
                className="text-yellow-400 hover:text-yellow-300"
              >
                Створити перший квест
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`bg-gray-800 bg-opacity-50 rounded-lg p-6 border ${
                  quest.isUrgent ? 'border-red-500' : 'border-gray-700'
                }`}
              >
                {/* Quest Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {quest.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={difficulties[quest.difficulty as keyof typeof difficulties]?.color}>
                        {difficulties[quest.difficulty as keyof typeof difficulties]?.emoji}
                        {difficulties[quest.difficulty as keyof typeof difficulties]?.label}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">
                        {categories[quest.category as keyof typeof categories]?.emoji}
                        {categories[quest.category as keyof typeof categories]?.label}
                      </span>
                    </div>
                  </div>
                  {quest.isUrgent && (
                    <span className="text-red-400 text-sm font-bold">⚡ ТЕРМІНОВО</span>
                  )}
                </div>

                {/* Quest Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {quest.description}
                </p>

                {/* Quest Details */}
                <div className="space-y-2 mb-4">
                  {quest.location && (
                    <div className="text-sm text-gray-400">
                      📍 {quest.location}
                    </div>
                  )}
                  {quest.dueDate && (
                    <div className="text-sm text-gray-400">
                      ⏰ {formatDate(quest.dueDate)}
                    </div>
                  )}
                  <div className="text-sm text-gray-400">
                    🕐 {formatDate(quest.createdAt)}
                  </div>
                </div>

                {/* Quest Status */}
                <div className="mb-4">
                  <span className={`text-sm font-bold ${statuses[quest.status as keyof typeof statuses]?.color}`}>
                    {statuses[quest.status as keyof typeof statuses]?.emoji}
                    {statuses[quest.status as keyof typeof statuses]?.label}
                  </span>
                </div>

                {/* Quest Rewards */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-4 text-sm">
                    <span className="text-yellow-400">🪙 {quest.reward}</span>
                    <span className="text-blue-400">⭐ {quest.experience}</span>
                  </div>
                </div>

                {/* Quest Actions */}
                <div className="space-y-2">
                  {quest.status === 'OPEN' && activeTab === 'available' && (
                    <button
                      onClick={() => handleAcceptQuest(quest.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Прийняти Квест
                    </button>
                  )}
                  
                  {quest.status === 'OPEN' && activeTab === 'assigned' && (
                    <button
                      onClick={() => handleAcceptQuest(quest.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Прийняти Квест
                    </button>
                  )}
                  
                  {quest.status === 'IN_PROGRESS' && quest.receiver?.id === session.user.id && (
                    <button
                      onClick={() => openCompleteModal(quest)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Здати Квест ✅
                    </button>
                  )}

                  {/* Quest Creator/Receiver Info */}
                  {quest.creator && (
                    <div className="text-xs text-gray-400">
                      Створив: {quest.creator.heroName || quest.creator.name}
                      {quest.creator.heroClass && ` (${quest.creator.heroClass})`}
                    </div>
                  )}
                  {quest.receiver && (
                    <div className="text-xs text-gray-400">
                      Виконує: {quest.receiver.heroName || quest.receiver.name}
                      {quest.receiver.heroClass && ` (${quest.receiver.heroClass})`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Complete Quest Modal */}
        {showCompleteModal && selectedQuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">
                Здати квест: {selectedQuest.title}
              </h3>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Ви впевнені, що хочете здати цей квест? Це дозволить вам отримати нагороди:
                </p>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-yellow-400">🪙 Золото:</span>
                    <span className="text-white font-bold">{selectedQuest.reward}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400">⭐ Досвід:</span>
                    <span className="text-white font-bold">{selectedQuest.experience}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleCompleteQuest(selectedQuest.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Здати Квест ✅
                </button>
                <button
                  onClick={() => {
                    setShowCompleteModal(false)
                    setSelectedQuest(null)
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 