'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getHeroClassLabel } from '@/lib/heroClasses'
import { SearchIcon, FilterIcon, PlusIcon, ClockIcon, CheckIcon, XIcon, SparklesIcon, SwordIcon, CoinsIcon, UserIcon, ArrowLeftIcon } from 'lucide-react'

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
  creatorId: string
  receiverId?: string
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
      case 'EASY': return 'bg-emerald-800 text-emerald-200 border-emerald-600'
      case 'MEDIUM': return 'bg-amber-800 text-amber-200 border-amber-600'
      case 'HARD': return 'bg-red-900 text-red-200 border-red-600'
      case 'EPIC': return 'bg-purple-900 text-purple-200 border-purple-600'
      default: return 'bg-gray-700 text-gray-300 border-gray-600'
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
          <Link 
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2">⚔️</span>
            Увійти в систему
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1b26] text-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      {/* Floating magical orbs */}
      <div className="absolute top-32 left-8 w-2 h-2 bg-[#624cab] rounded-full opacity-15 animate-pulse animation-delay-1000"></div>
      <div className="absolute top-16 right-12 w-1 h-1 bg-[#a48fff] rounded-full opacity-20 animate-pulse animation-delay-1500"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-[#3d2b6b] rounded-full opacity-10 animate-pulse animation-delay-800"></div>
      <div className="absolute bottom-16 right-8 w-1 h-1 bg-[#d4c6ff] rounded-full opacity-15 animate-pulse animation-delay-1200"></div>
      
      {/* Mystical runes and symbols - moved to top and bottom only */}
      <div className="absolute top-8 left-1/4 text-[#624cab] opacity-4 text-2xl">⚔️</div>
      <div className="absolute bottom-8 right-1/3 text-[#a48fff] opacity-3 text-xl">🏰</div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
        
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-[#624cab] opacity-12"></div>
      <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-[#624cab] opacity-12"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-[#624cab] opacity-12"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-[#624cab] opacity-12"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Link 
                href="/"
                className="mr-4 p-2 rounded-lg bg-[#252838] border border-[#4a4257] hover:border-[#624cab] transition-colors"
              >
                <ArrowLeftIcon size={20} className="text-[#a48fff]" />
              </Link>
              <h1 className="text-4xl font-bold text-[#d4c6ff] drop-shadow-lg">
                Мої Квести
              </h1>
              <div className="ml-2 text-3xl text-[#a48fff] opacity-80">⚔️</div>
            </div>
            <p className="text-xl text-gray-300">
              Керуй своїми епічними місіями!
            </p>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 border border-red-500">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="relative mb-6 rounded-lg overflow-hidden max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
              {/* Magical sparkles */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
            </div>
            <div className="bg-[#252838] p-1 rounded-lg relative z-10">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors rounded-md ${
                    activeTab === 'all'
                      ? 'text-[#d4c6ff] bg-[#624cab] shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#2a2d3d]'
                  }`}
                >
                  Всі квести
                </button>
                <button
                  onClick={() => setActiveTab('assigned')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors rounded-md ${
                    activeTab === 'assigned'
                      ? 'text-[#d4c6ff] bg-[#624cab] shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#2a2d3d]'
                  }`}
                >
                  Призначені мені
                </button>
                <button
                  onClick={() => setActiveTab('created')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors rounded-md ${
                    activeTab === 'created'
                      ? 'text-[#d4c6ff] bg-[#624cab] shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#2a2d3d]'
                  }`}
                >
                  Створені мною
                </button>
              </div>
            </div>
          </div>

          {/* Search and Create */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
              </div>
              <div className="relative bg-[#252838] rounded-lg p-[1px]">
                <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a48fff] z-10" />
                <input
                  type="text"
                  placeholder="Пошук квестів..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-3 bg-[#1a1d29] border border-[#4a4257] rounded-lg text-gray-100 placeholder-gray-400 focus:border-[#624cab] focus:outline-none transition-colors"
                />
              </div>
            </div>
            <Link
              href="/quests/create"
              className="relative font-medium tracking-wide rounded-md flex items-center justify-center py-3 px-6 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
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
                      className="relative font-medium tracking-wide rounded-md flex items-center justify-center py-3 px-6 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105 inline-flex"
                    >
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                      <PlusIcon size={16} className="mr-2" />
                      Створити перший квест
                    </Link>
                  )}
                </div>
              ) : (
                                 <div className="grid gap-6">
                   {filteredQuests.map((quest) => (
                     <div key={quest.id} className="relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                       {/* Decorative border with magical effect */}
                       <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[2px] rounded-xl overflow-hidden">
                         {/* Top-right corner decoration */}
                         <div className="absolute top-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-bl-xl border-b border-l border-[#7a63d4]">
                           <SparklesIcon size={12} className="text-[#a48fff]" />
                         </div>
                         {/* Top-left corner decoration */}
                         <div className="absolute top-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-br-xl border-b border-r border-[#7a63d4]">
                           <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                         </div>
                         {/* Bottom-right corner decoration */}
                         <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tl-xl border-t border-l border-[#7a63d4]">
                           <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                         </div>
                         {/* Bottom-left corner decoration */}
                         <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tr-xl border-t border-r border-[#7a63d4]">
                           <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                         </div>
                         
                         {/* Magical sparkles - edge decorations */}
                         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                         <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                         <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-500"></div>
                         
                         {/* Additional edge decorations */}
                         <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                         <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                         <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                         <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
                         
                         {/* Middle edge decorations */}
                         <div className="absolute top-1/2 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                         <div className="absolute top-1/2 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-700"></div>
                         <div className="absolute left-1/2 top-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                         <div className="absolute left-1/2 bottom-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-500"></div>
                       </div>
                       
                       {/* Card content */}
                       <div className="bg-[#252838] p-6 rounded-xl relative z-10">
                         {/* Quest Header */}
                         <div className="flex items-start justify-between mb-4">
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center mb-2">
                               <h3 className="text-xl font-bold text-[#d4c6ff] truncate">
                                 {quest.title}
                               </h3>
                               {quest.isUrgent && (
                                 <span className="ml-2 text-red-400 text-sm bg-red-900/20 px-2 py-1 rounded-full">⚡ Терміново</span>
                               )}
                             </div>
                             <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{quest.description}</p>
                           </div>
                           <div className="text-right ml-4 flex-shrink-0">
                             <div className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold border-2 shadow-lg ${getDifficultyColor(quest.difficulty)}`}>
                               {getDifficultyText(quest.difficulty)}
                             </div>
                             <div className={`text-sm mt-2 font-medium ${getStatusColor(quest.status)}`}>
                               {getStatusText(quest.status)}
                             </div>
                           </div>
                         </div>

                         {/* Quest Details - Enhanced */}
                         <div className="bg-[#1a1d29] rounded-lg p-4 mb-4 border border-[#4a4257]">
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                             <div className="flex items-center">
                               <div className="w-8 h-8 bg-[#624cab]/20 rounded-full flex items-center justify-center mr-3">
                                 <UserIcon size={14} className="text-[#a48fff]" />
                               </div>
                               <div>
                                 <div className="text-gray-400 text-xs">Створив</div>
                                 <div className="text-gray-200 font-medium truncate">
                                   {quest.creator.heroName || quest.creator.name}
                                 </div>
                               </div>
                             </div>
                             {quest.receiver && (
                               <div className="flex items-center">
                                 <div className="w-8 h-8 bg-[#624cab]/20 rounded-full flex items-center justify-center mr-3">
                                   <UserIcon size={14} className="text-[#a48fff]" />
                                 </div>
                                 <div>
                                   <div className="text-gray-400 text-xs">Виконує</div>
                                   <div className="text-gray-200 font-medium truncate">
                                     {quest.receiver.heroName || quest.receiver.name}
                                   </div>
                                 </div>
                               </div>
                             )}
                             <div className="flex items-center">
                               <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                                 <CoinsIcon size={14} className="text-yellow-400" />
                               </div>
                               <div>
                                 <div className="text-gray-400 text-xs">Нагорода</div>
                                 <div className="text-yellow-300 font-bold">{quest.reward} 🪙</div>
                               </div>
                             </div>
                             <div className="flex items-center">
                               <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                                 <SparklesIcon size={14} className="text-blue-400" />
                               </div>
                               <div>
                                 <div className="text-gray-400 text-xs">Досвід</div>
                                 <div className="text-blue-300 font-bold">{quest.experience} ⭐</div>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Quest Actions */}
                         <div className="flex flex-wrap gap-3">
                           {quest.status === 'OPEN' && quest.receiverId === session.user.id && (
                             <button
                               onClick={() => handleAcceptQuest(quest.id)}
                               className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-2.5 px-4 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105"
                             >
                               <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                               <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                               Прийняти квест
                             </button>
                           )}
                           
                           {quest.status === 'IN_PROGRESS' && quest.receiverId === session.user.id && (
                             <button
                               onClick={() => handleCompleteQuest(quest.id)}
                               className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border border-emerald-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                             >
                               <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-emerald-300 opacity-50 rounded-full"></span>
                               <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-emerald-300 opacity-50 rounded-full"></span>
                               Завершити квест
                             </button>
                           )}
                           
                           {(quest.status === 'OPEN' || quest.status === 'IN_PROGRESS') && quest.creatorId === session.user.id && (
                             <button
                               onClick={() => handleCancelQuest(quest.id)}
                               className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border border-red-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                             >
                               <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-red-300 opacity-50 rounded-full"></span>
                               <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-red-300 opacity-50 rounded-full"></span>
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
    </div>
  )
} 