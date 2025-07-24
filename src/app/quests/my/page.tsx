'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getHeroClassLabel } from '@/lib/heroClasses'
import { SearchIcon, FilterIcon, PlusIcon, ClockIcon, CheckIcon, XIcon, SparklesIcon, SwordIcon, CoinsIcon, UserIcon } from 'lucide-react'

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
  creator: {
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

type TabType = 'all' | 'assigned' | 'created'

export default function MyQuests() {
  const { data: session, status } = useSession()
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    if (session) {
      fetchQuests()
    }
  }, [session, activeTab])

  const fetchQuests = async () => {
    try {
      setLoading(true)
      const type = activeTab === 'assigned' ? 'assigned_to_me' : 
                   activeTab === 'created' ? 'created_by_me' : 'all'
      
      const response = await fetch(`/api/quests?type=${type}`)
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
        fetchQuests()
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
      }
    } catch (err) {
      setError('Помилка скасування квесту')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-emerald-800 text-emerald-200'
      case 'MEDIUM': return 'bg-amber-800 text-amber-200'
      case 'HARD': return 'bg-red-900 text-red-200'
      case 'EPIC': return 'bg-purple-900 text-purple-200'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'Легкий'
      case 'MEDIUM': return 'Середній'
      case 'HARD': return 'Важкий'
      case 'EPIC': return 'Епічний'
      default: return difficulty
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-yellow-400'
      case 'IN_PROGRESS': return 'text-blue-400'
      case 'COMPLETED': return 'text-emerald-400'
      case 'FAILED': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Відкритий'
      case 'IN_PROGRESS': return 'В процесі'
      case 'COMPLETED': return 'Завершено'
      case 'FAILED': return 'Провалено'
      default: return status
    }
  }

  const filteredQuests = quests.filter(quest =>
    quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quest.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-400 mb-4">Доступ заборонено</h1>
          <p className="text-gray-300 mb-4">Потрібно увійти для перегляду квестів</p>
          <Link href="/auth/signin" className="text-[#a48fff] hover:text-[#d4c6ff]">
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
          <h1 className="text-4xl font-bold text-[#d4c6ff] mb-2">
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
        <div className="flex border-b border-[#4a4257] mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-[#d4c6ff] border-b-2 border-[#a48fff]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Всі квести
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'assigned'
                ? 'text-[#d4c6ff] border-b-2 border-[#a48fff]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Призначені мені
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'created'
                ? 'text-[#d4c6ff] border-b-2 border-[#a48fff]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Створені мною
          </button>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a48fff]" />
            <input
              type="text"
              placeholder="Пошук квестів..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-magical w-full pl-10 p-3 rounded-lg"
            />
          </div>
          <Link
            href="/quests/create"
            className="btn-primary text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <PlusIcon size={16} className="mr-2" />
            Створити квест
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 animate-spin">
                <div className="w-full h-full border-4 border-transparent border-t-[#a48fff] border-r-[#624cab] rounded-full"></div>
              </div>
              <div className="absolute inset-2 bg-[#252838] rounded-full flex items-center justify-center">
                <span className="text-[#a48fff] text-xs font-bold">⚔️</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#d4c6ff] mb-2">
              Завантаження квестів...
            </h2>
            <p className="text-gray-300">
              Знаходимо твої місії
            </p>
          </div>
        )}

        {/* Quests List */}
        {!loading && (
          <>
            {filteredQuests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-xl mb-4">
                  {searchTerm ? 'Квестів не знайдено' : 'Немає квестів'}
                </div>
                {!searchTerm && (
                  <Link
                    href="/quests/create"
                    className="btn-primary text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
                  >
                    <PlusIcon size={16} className="mr-2" />
                    Створити перший квест
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuests.map((quest) => (
                  <div key={quest.id} className="card-magical-border">
                    <div className="card-magical-content p-6">
                      {/* Quest Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#d4c6ff] mb-2">
                            {quest.title}
                            {quest.isUrgent && (
                              <span className="ml-2 text-red-400 text-sm">⚡ Терміново</span>
                            )}
                          </h3>
                          <p className="text-gray-300 mb-3">{quest.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                            {getDifficultyText(quest.difficulty)}
                          </div>
                          <div className={`text-sm mt-1 ${getStatusColor(quest.status)}`}>
                            {getStatusText(quest.status)}
                          </div>
                        </div>
                      </div>

                      {/* Quest Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm">
                          <UserIcon size={14} className="text-[#a48fff] mr-2" />
                          <span className="text-gray-300">
                            {quest.creator.heroName || quest.creator.name}
                          </span>
                        </div>
                        {quest.receiver && (
                          <div className="flex items-center text-sm">
                            <UserIcon size={14} className="text-[#a48fff] mr-2" />
                            <span className="text-gray-300">
                              Виконує: {quest.receiver.heroName || quest.receiver.name}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <CoinsIcon size={14} className="text-yellow-400 mr-2" />
                          <span className="text-gray-300">{quest.reward} 🪙</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <SparklesIcon size={14} className="text-blue-400 mr-2" />
                          <span className="text-gray-300">{quest.experience} ⭐</span>
                        </div>
                      </div>

                      {/* Quest Actions */}
                      <div className="flex flex-wrap gap-2">
                        {quest.status === 'OPEN' && quest.receiverId === session.user.id && (
                          <button
                            onClick={() => handleAcceptQuest(quest.id)}
                            className="btn-primary text-white font-bold py-2 px-4 rounded transition-colors"
                          >
                            Прийняти квест
                          </button>
                        )}
                        
                        {quest.status === 'IN_PROGRESS' && quest.receiverId === session.user.id && (
                          <button
                            onClick={() => handleCompleteQuest(quest.id)}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-2 px-4 rounded transition-colors border border-emerald-500"
                          >
                            Завершити квест
                          </button>
                        )}
                        
                        {(quest.status === 'OPEN' || quest.status === 'IN_PROGRESS') && quest.creatorId === session.user.id && (
                          <button
                            onClick={() => handleCancelQuest(quest.id)}
                            className="btn-danger text-white font-bold py-2 px-4 rounded transition-colors"
                          >
                            Скасувати квест
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 