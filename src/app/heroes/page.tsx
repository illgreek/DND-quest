'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

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

export default function Heroes() {
  const { data: session } = useSession()
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [friendships, setFriendships] = useState<Friendship[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  const heroClasses = {
    Warrior: { label: 'Воїн', emoji: '⚔️', color: 'text-red-400' },
    Mage: { label: 'Маг', emoji: '🔮', color: 'text-blue-400' },
    Rogue: { label: 'Розбійник', emoji: '🗡️', color: 'text-purple-400' },
    Cleric: { label: 'Жрець', emoji: '⛪', color: 'text-white' },
    Ranger: { label: 'Рейнджер', emoji: '🏹', color: 'text-green-400' },
    Paladin: { label: 'Паладін', emoji: '🛡️', color: 'text-yellow-400' }
  }

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
        fetchFriendships()
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
        fetchFriendships()
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
        fetchFriendships()
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

  const filteredHeroes = heroes.filter(hero => 
    hero.id !== session?.user.id &&
    (hero.heroName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     hero.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     hero.heroClass?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const pendingRequests = friendships.filter(f => 
    f.receiverId === session?.user.id && f.status === 'PENDING'
  )

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-400 mb-4">Доступ заборонено</h1>
          <p className="text-gray-300 mb-4">Потрібно увійти для пошуку героїв</p>
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
            Знайти Героїв
          </h1>
          <p className="text-gray-300">
            Знайди союзників для епічних пригод!
          </p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Pending Friend Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-blue-400 mb-3">
              Запити дружби ({pendingRequests.length})
            </h3>
            <div className="space-y-2">
              {pendingRequests.map((request) => {
                const sender = heroes.find(h => h.id === request.senderId)
                return sender ? (
                  <div key={request.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
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
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Прийняти
                      </button>
                      <button
                        onClick={() => handleRejectFriendRequest(request.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Відхилити
                      </button>
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Пошук героїв за іменем або класом..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
          />
        </div>

        {/* Heroes List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-yellow-400 text-xl">Завантаження героїв...</div>
          </div>
        ) : filteredHeroes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-xl">
              {searchTerm ? 'Героїв не знайдено' : 'Немає доступних героїв'}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHeroes.map((hero) => {
              const friendshipStatus = getFriendshipStatus(hero.id)
              const heroClass = heroClasses[hero.heroClass as keyof typeof heroClasses]

              return (
                <div key={hero.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
                  {/* Hero Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">
                      {heroClass?.emoji || '👤'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">
                        {hero.heroName || hero.name}
                      </h3>
                      <div className="text-sm text-gray-400">
                        {heroClass?.label} • Рівень {hero.heroLevel}
                      </div>
                    </div>
                  </div>

                  {/* Hero Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{hero.gold}</div>
                      <div className="text-xs text-gray-400">🪙 Золото</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{hero.experience}</div>
                      <div className="text-xs text-gray-400">⭐ Досвід</div>
                    </div>
                  </div>

                  {/* Friendship Status */}
                  <div className="mb-4">
                    {friendshipStatus === 'PENDING' && (
                      <div className="text-yellow-400 text-sm text-center">
                        ⏳ Запит дружби відправлено
                      </div>
                    )}
                    {friendshipStatus === 'ACCEPTED' && (
                      <div className="text-green-400 text-sm text-center">
                        ✅ Друзі
                      </div>
                    )}
                    {friendshipStatus === 'REJECTED' && (
                      <div className="text-red-400 text-sm text-center">
                        ❌ Запит відхилено
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!friendshipStatus && (
                    <button
                      onClick={() => handleSendFriendRequest(hero.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Додати в друзі
                    </button>
                  )}

                  {friendshipStatus === 'ACCEPTED' && (
                    <Link
                      href={`/quests/create?assignTo=${hero.id}`}
                      className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-center"
                    >
                      Доручити квест
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
} 