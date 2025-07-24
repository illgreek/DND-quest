'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { heroClasses } from '@/lib/heroClasses'
import { SearchIcon, UserPlusIcon, CheckIcon, XIcon, SparklesIcon, ArrowLeftIcon } from 'lucide-react'

interface Hero {
  id: string
  name?: string
  heroName?: string
  heroClass?: string
  heroLevel: number
  experience: number
  gold: number
  createdAt: string
}

interface Friendship {
  id: string
  status: string
  senderId: string
  receiverId: string
  createdAt: string
}

type TabType = 'search' | 'my-heroes'

export default function Heroes() {
  const { data: session, status } = useSession()
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [friendships, setFriendships] = useState<Friendship[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('search')

  useEffect(() => {
    fetchHeroes()
    fetchFriendships()
  }, [])

  const fetchHeroes = async () => {
    try {
      const response = await fetch('/api/heroes')
      if (response.ok) {
        const data = await response.json()
        setHeroes(data)
      } else {
        setError('Помилка завантаження героїв')
      }
    } catch (err) {
      setError('Помилка завантаження героїв')
    } finally {
      setLoading(false)
    }
  }

  const fetchFriendships = async () => {
    try {
      const response = await fetch('/api/friendships')
      if (response.ok) {
        const data = await response.json()
        setFriendships(data)
      }
    } catch (err) {
      console.error('Error fetching friendships:', err)
    }
  }

  const handleSendFriendRequest = async (heroId: string) => {
    try {
      const response = await fetch('/api/friendships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId: heroId }),
      })

      if (response.ok) {
        await Promise.all([fetchFriendships(), fetchHeroes()])
        window.dispatchEvent(new CustomEvent('friendship-updated'))
      } else {
        setError('Помилка відправки запиту дружби')
      }
    } catch (err) {
      setError('Помилка відправки запиту дружби')
    }
  }

  const handleAcceptFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/friendships/${friendshipId}/accept`, {
        method: 'POST'
      })

      if (response.ok) {
        await Promise.all([fetchFriendships(), fetchHeroes()])
        window.dispatchEvent(new CustomEvent('friendship-updated'))
      }
    } catch (err) {
      setError('Помилка прийняття запиту дружби')
    }
  }

  const handleRejectFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/friendships/${friendshipId}/reject`, {
        method: 'POST'
      })

      if (response.ok) {
        await Promise.all([fetchFriendships(), fetchHeroes()])
        window.dispatchEvent(new CustomEvent('friendship-updated'))
      }
    } catch (err) {
      setError('Помилка відхилення запиту дружби')
    }
  }

  const getFriendshipStatus = (heroId: string) => {
    const friendship = friendships.find(f => 
      (f.senderId === heroId && f.receiverId === session?.user.id) ||
      (f.receiverId === heroId && f.senderId === session?.user.id)
    )
    return friendship?.status || null
  }

  // Фільтрація героїв для пошуку (всі крім себе)
  const searchHeroes = heroes.filter(hero => 
    hero.id !== session?.user.id &&
    (hero.heroName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     hero.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     hero.heroClass?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     heroClasses[hero.heroClass as keyof typeof heroClasses]?.label.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Фільтрація моїх героїв (друзі)
  const myHeroes = heroes.filter(hero => {
    if (hero.id === session?.user.id) return false
    const friendshipStatus = getFriendshipStatus(hero.id)
    return friendshipStatus === 'ACCEPTED'
  })

  const pendingRequests = friendships.filter(f => 
    f.receiverId === session?.user.id && f.status === 'PENDING'
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
          <p className="text-gray-300 mb-4">Потрібно увійти для пошуку героїв</p>
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
                Герої
              </h1>
              <div className="ml-2 text-3xl text-[#a48fff] opacity-80">⚔️</div>
            </div>
            <p className="text-xl text-gray-300">
              Знайди союзників та керуй своєю командою!
            </p>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 border border-red-500">
              {error}
            </div>
          )}

          {/* Pending Friend Requests */}
          {pendingRequests.length > 0 && (
            <div className="relative mb-6 rounded-lg overflow-hidden max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
              </div>
              <div className="bg-[#252838] p-6 rounded-lg relative z-10">
                <h3 className="text-lg font-bold text-[#a48fff] mb-4 flex items-center">
                  <UserPlusIcon size={16} className="mr-2" />
                  Запити дружби ({pendingRequests.length})
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((request) => {
                    const sender = heroes.find(h => h.id === request.senderId)
                    return sender ? (
                      <div key={request.id} className="flex items-center justify-between bg-[#1a1d29] rounded-lg p-4 border border-[#4a4257]">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {heroClasses[sender.heroClass as keyof typeof heroClasses]?.emoji || '👤'}
                          </div>
                          <div>
                            <div className="font-bold text-white">
                              {sender.heroName || sender.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {heroClasses[sender.heroClass as keyof typeof heroClasses]?.label} • Рівень {sender.heroLevel}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptFriendRequest(request.id)}
                            className="relative font-medium tracking-wide rounded-md flex items-center justify-center text-sm py-2 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border border-emerald-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <span className="absolute left-1 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-emerald-300 opacity-50 rounded-full"></span>
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-emerald-300 opacity-50 rounded-full"></span>
                            <CheckIcon size={12} className="mr-1" />
                            Прийняти
                          </button>
                          <button
                            onClick={() => handleRejectFriendRequest(request.id)}
                            className="relative font-medium tracking-wide rounded-md flex items-center justify-center text-sm py-2 px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border border-red-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <span className="absolute left-1 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-red-300 opacity-50 rounded-full"></span>
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-red-300 opacity-50 rounded-full"></span>
                            <XIcon size={12} className="mr-1" />
                            Відхилити
                          </button>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="relative mb-6 rounded-lg overflow-hidden max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
            </div>
            <div className="bg-[#252838] p-1 rounded-lg relative z-10">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors rounded-md ${
                    activeTab === 'search'
                      ? 'text-[#d4c6ff] bg-[#624cab] shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#2a2d3d]'
                  }`}
                >
                  Пошук героїв
                </button>
                <button
                  onClick={() => setActiveTab('my-heroes')}
                  className={`flex-1 px-4 py-3 font-medium transition-colors rounded-md ${
                    activeTab === 'my-heroes'
                      ? 'text-[#d4c6ff] bg-[#624cab] shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#2a2d3d]'
                  }`}
                >
                  Мої герої ({myHeroes.length})
                </button>
              </div>
            </div>
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
                Завантаження героїв...
              </h2>
              <p className="text-gray-300">
                Знаходимо героїв для твоїх пригод
              </p>
            </div>
          )}

          {/* Search Tab */}
          {!loading && activeTab === 'search' && (
            <>
              {/* Search Input */}
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                  </div>
                  <div className="relative bg-[#252838] rounded-lg p-[1px]">
                    <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a48fff] z-10" />
                    <input
                      type="text"
                      placeholder="Пошук героїв за іменем або класом..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 p-3 bg-[#1a1d29] border border-[#4a4257] rounded-lg text-gray-100 placeholder-gray-400 focus:border-[#624cab] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Search Results */}
              {searchHeroes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-xl">
                    {searchTerm ? 'Героїв не знайдено' : 'Немає доступних героїв'}
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchHeroes.map((hero) => {
                    const friendshipStatus = getFriendshipStatus(hero.id)
                    const heroClass = heroClasses[hero.heroClass as keyof typeof heroClasses]

                    return (
                      <div key={hero.id} className="relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
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
                          
                          {/* Magical sparkles */}
                          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                          <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                          <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                        </div>
                        
                        {/* Card content */}
                        <div className="bg-[#252838] p-6 rounded-xl relative z-10">
                          {/* Hero Header */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-4xl">
                              {heroClass?.emoji || '👤'}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-[#d4c6ff]">
                                {hero.heroName || hero.name}
                              </h3>
                              <div className="text-sm text-gray-400">
                                {heroClass?.label} • Рівень {hero.heroLevel}
                              </div>
                            </div>
                          </div>

                          {/* Hero Stats */}
                          <div className="bg-[#1a1d29] rounded-lg p-4 mb-4 border border-[#4a4257]">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-yellow-400 text-lg">🪙</span>
                                </div>
                                <div>
                                  <div className="text-gray-400 text-xs">Золото</div>
                                  <div className="text-yellow-300 font-bold">{hero.gold}</div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-400 text-lg">⭐</span>
                                </div>
                                <div>
                                  <div className="text-gray-400 text-xs">Досвід</div>
                                  <div className="text-blue-300 font-bold">{hero.experience}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Friendship Status */}
                          <div className="mb-4">
                            {friendshipStatus === 'PENDING' && (
                              <div className="text-yellow-400 text-sm text-center flex items-center justify-center bg-yellow-900/20 py-2 rounded-lg">
                                <SparklesIcon size={12} className="mr-1" />
                                Запит дружби відправлено
                              </div>
                            )}
                            {friendshipStatus === 'ACCEPTED' && (
                              <div className="text-emerald-400 text-sm text-center flex items-center justify-center bg-emerald-900/20 py-2 rounded-lg">
                                <CheckIcon size={12} className="mr-1" />
                                Друзі
                              </div>
                            )}
                            {friendshipStatus === 'REJECTED' && (
                              <div className="text-red-400 text-sm text-center flex items-center justify-center bg-red-900/20 py-2 rounded-lg">
                                <XIcon size={12} className="mr-1" />
                                Запит відхилено
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          {!friendshipStatus && (
                            <button
                              onClick={() => handleSendFriendRequest(hero.id)}
                              className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-2.5 px-4 w-full bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                              Додати в друзі
                            </button>
                          )}

                          {friendshipStatus === 'ACCEPTED' && (
                            <Link
                              href={`/quests/create?assignTo=${hero.id}`}
                              className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-2.5 px-4 w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border border-emerald-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-emerald-300 opacity-50 rounded-full"></span>
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-emerald-300 opacity-50 rounded-full"></span>
                              Доручити квест
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* My Heroes Tab */}
          {!loading && activeTab === 'my-heroes' && (
            <>
              {myHeroes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-xl mb-4">
                    У вас поки немає друзів-героїв
                  </div>
                  <p className="text-gray-500">
                    Перейдіть на вкладку "Пошук героїв" щоб знайти союзників
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myHeroes.map((hero) => {
                    const heroClass = heroClasses[hero.heroClass as keyof typeof heroClasses]

                    return (
                      <div key={hero.id} className="relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
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
                          
                          {/* Magical sparkles */}
                          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                          <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                          <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                        </div>
                        
                        {/* Card content */}
                        <div className="bg-[#252838] p-6 rounded-xl relative z-10">
                          {/* Hero Header */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-4xl">
                              {heroClass?.emoji || '👤'}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-[#d4c6ff]">
                                {hero.heroName || hero.name}
                              </h3>
                              <div className="text-sm text-gray-400">
                                {heroClass?.label} • Рівень {hero.heroLevel}
                              </div>
                            </div>
                          </div>

                          {/* Hero Stats */}
                          <div className="bg-[#1a1d29] rounded-lg p-4 mb-4 border border-[#4a4257]">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-yellow-400 text-lg">🪙</span>
                                </div>
                                <div>
                                  <div className="text-gray-400 text-xs">Золото</div>
                                  <div className="text-yellow-300 font-bold">{hero.gold}</div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-400 text-lg">⭐</span>
                                </div>
                                <div>
                                  <div className="text-gray-400 text-xs">Досвід</div>
                                  <div className="text-blue-300 font-bold">{hero.experience}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Friendship Status */}
                          <div className="mb-4">
                            <div className="text-emerald-400 text-sm text-center flex items-center justify-center bg-emerald-900/20 py-2 rounded-lg">
                              <CheckIcon size={12} className="mr-1" />
                              Друзі
                            </div>
                          </div>

                          {/* Actions */}
                          <Link
                            href={`/quests/create?assignTo=${hero.id}`}
                            className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-2.5 px-4 w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border border-emerald-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-emerald-300 opacity-50 rounded-full"></span>
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-emerald-300 opacity-50 rounded-full"></span>
                            Доручити квест
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 