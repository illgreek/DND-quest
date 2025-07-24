'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getHeroClassLabel } from '@/lib/heroClasses'
import { SearchIcon, FilterIcon, PlusIcon, ClockIcon, CheckIcon, XIcon, SparklesIcon, SwordIcon, CoinsIcon, UserIcon, ArrowLeftIcon } from 'lucide-react'
import { getCurrentLevel, getNextLevel, getLevelProgress } from '@/lib/heroLevels'

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
  const { data: session, status, update } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (session) {
      fetchQuests()
    }
  }, [session, activeTab])

  // Слухаємо події оновлення сесії
  useEffect(() => {
    const handleSessionUpdate = async () => {
      await update()
    }

    window.addEventListener('session-updated', handleSessionUpdate)
    return () => window.removeEventListener('session-updated', handleSessionUpdate)
  }, [update])

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
        setError('')
        setSuccessMessage('Квест успішно прийнято!')
        setTimeout(() => setSuccessMessage(''), 3000)
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
        
        // Оновлюємо сесію з новими даними користувача
        if (result.user) {
          // Очищаємо попередні помилки
          setError('')
          
          // Показуємо повідомлення про успіх
          setSuccessMessage(`Квест завершено! +${result.rewards.experience} XP, +${result.rewards.gold} золота`)
          
          // Очищаємо повідомлення через 3 секунди
          setTimeout(() => setSuccessMessage(''), 3000)
          
          // Оновлюємо сесію з новими даними
          await update({
            ...session,
            user: {
              ...session?.user,
              experience: result.user.experience,
              gold: result.user.gold,
              heroLevel: result.user.heroLevel
            }
          })
          
          console.log('Updated session with:', {
            experience: result.user.experience,
            gold: result.user.gold,
            heroLevel: result.user.heroLevel,
            levelUp: result.rewards.levelUp
          })
          
          // Викликаємо подію оновлення сесії
          window.dispatchEvent(new Event('session-updated'))
          
          // Невелика затримка для забезпечення оновлення сесії
          setTimeout(() => {
            router.refresh()
          }, 100)
        }
        
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
        setError('')
        setSuccessMessage('Квест успішно скасовано!')
        setTimeout(() => setSuccessMessage(''), 3000)
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
          <p className="text-gray-300 mb-4">Потрібно увійти для перегляду квестів</p>
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
        <div className="max-w-6xl mx-auto">
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
                Мої Квести
              </h1>
              <div className="ml-2 text-3xl text-theme-accent opacity-80">⚔️</div>
            </div>
            <p className="text-xl text-gray-300 lg:bg-transparent bg-theme-surface lg:bg-opacity-0 bg-opacity-90 px-4 py-2 rounded-lg">
              Керуй своїми епічними місіями!
            </p>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 border border-red-500">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-6 border border-green-500">
              {successMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="relative mb-6 rounded-lg overflow-hidden max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-theme p-[1px] rounded-lg overflow-hidden">
              {/* Magical sparkles */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-200"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-400"></div>
            </div>
            <div className="bg-theme-surface p-1 rounded-lg relative z-10">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors rounded-md ${
                    activeTab === 'all'
                      ? 'text-gray-100 bg-theme-primary shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-theme-surface'
                  }`}
                >
                  Всі квести
                </button>
                <button
                  onClick={() => setActiveTab('assigned')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors rounded-md ${
                    activeTab === 'assigned'
                      ? 'text-gray-100 bg-theme-primary shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-theme-surface'
                  }`}
                >
                  Призначені мені
                </button>
                <button
                  onClick={() => setActiveTab('created')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors rounded-md ${
                    activeTab === 'created'
                      ? 'text-gray-100 bg-theme-primary shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-theme-surface'
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
              <div className="absolute inset-0 bg-gradient-theme p-[1px] rounded-lg overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
              </div>
              <div className="relative bg-theme-surface rounded-lg p-[1px]">
                <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-accent z-10" />
                <input
                  type="text"
                  placeholder="Пошук квестів..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-3 bg-theme-background border border-theme-border rounded-lg text-gray-100 placeholder-gray-400 focus:border-theme-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
            <Link
              href="/quests/create"
              className="relative font-medium tracking-wide rounded-md flex items-center justify-center py-3 px-6 bg-gradient-theme text-gray-100 hover:bg-gradient-theme-hover border border-theme-primary shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-theme-accent opacity-50 rounded-full"></span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-theme-accent opacity-50 rounded-full"></span>
              <PlusIcon size={16} className="mr-2" />
              Створити квест
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
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
                      className="relative font-medium tracking-wide rounded-md flex items-center justify-center py-3 px-6 bg-gradient-theme text-gray-100 hover:bg-gradient-theme-hover border border-theme-primary shadow-lg transition-all duration-200 transform hover:scale-105 inline-flex"
                    >
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-theme-accent opacity-50 rounded-full"></span>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-theme-accent opacity-50 rounded-full"></span>
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
                         
                         {/* Magical sparkles - edge decorations */}
                         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                         <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                         <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-500"></div>
                         
                         {/* Additional edge decorations */}
                         <div className="absolute top-2 left-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-200"></div>
                         <div className="absolute top-2 right-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-400"></div>
                         <div className="absolute bottom-2 left-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-100"></div>
                         <div className="absolute bottom-2 right-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-600"></div>
                         
                         {/* Middle edge decorations */}
                         <div className="absolute top-1/2 left-2 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                         <div className="absolute top-1/2 right-2 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-700"></div>
                         <div className="absolute left-1/2 top-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-200"></div>
                         <div className="absolute left-1/2 bottom-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-500"></div>
                       </div>
                       
                       {/* Card content */}
                       <div className="bg-theme-surface p-6 rounded-xl relative z-10">
                         {/* Quest Header */}
                         <div className="flex items-start justify-between mb-4">
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center mb-2">
                                                            <h3 className="text-xl font-bold text-gray-100 truncate">
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
                         <div className="bg-theme-background rounded-lg p-4 mb-4 border border-theme-border">
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                             <div className="flex items-center">
                               <div className="w-8 h-8 bg-theme-primary/20 rounded-full flex items-center justify-center mr-3">
                                 <UserIcon size={14} className="text-theme-accent" />
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
                                 <div className="w-8 h-8 bg-theme-primary/20 rounded-full flex items-center justify-center mr-3">
                                   <UserIcon size={14} className="text-theme-accent" />
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
                               className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-2.5 px-4 bg-gradient-theme text-gray-100 hover:bg-gradient-theme-hover border border-theme-primary shadow-lg transition-all duration-200 transform hover:scale-105"
                             >
                               <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-theme-accent opacity-50 rounded-full"></span>
                               <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-theme-accent opacity-50 rounded-full"></span>
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