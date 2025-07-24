'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getHeroClassLabel } from '@/lib/heroClasses'
import { ArrowLeftIcon, SwordIcon, CoinsIcon, ClockIcon, MapPinIcon, SparklesIcon } from 'lucide-react'

interface Friend {
  id: string
  name?: string
  heroName?: string
  heroClass?: string
  heroLevel: number
}

export default function CreateQuestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [friends, setFriends] = useState<Friend[]>([])
  const [loadingFriends, setLoadingFriends] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: 10, // За замовчуванням для EASY складності
    experience: 5, // За замовчуванням для EASY складності
    difficulty: 'EASY',
    category: 'GENERAL',
    location: '',
    dueDate: '',
    isUrgent: false,
    assignTo: 'self' // За замовчуванням призначаємо собі
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const difficulties = [
    { value: 'EASY', label: 'Легкий', emoji: '🟢', reward: 10, exp: 5 },
    { value: 'MEDIUM', label: 'Середній', emoji: '🟡', reward: 25, exp: 15 },
    { value: 'HARD', label: 'Важкий', emoji: '🟠', reward: 50, exp: 30 },
    { value: 'EPIC', label: 'Епічний', emoji: '🔴', reward: 100, exp: 60 }
  ]

  const categories = [
    { value: 'SHOPPING', label: 'Покупки', emoji: '🛒' },
    { value: 'CHORES', label: 'Побутові справи', emoji: '🧹' },
    { value: 'WORK', label: 'Робота', emoji: '💼' },
    { value: 'PERSONAL', label: 'Особисте', emoji: '👤' },
    { value: 'HEALTH', label: 'Здоров\'я', emoji: '💊' },
    { value: 'STUDY', label: 'Навчання', emoji: '📚' },
    { value: 'GENERAL', label: 'Загальне', emoji: '📋' }
  ]

  const handleDifficultyChange = (difficulty: string) => {
    const selectedDifficulty = difficulties.find(d => d.value === difficulty)
    setFormData({
      ...formData,
      difficulty,
      reward: selectedDifficulty?.reward || 0,
      experience: selectedDifficulty?.exp || 0
    })
  }

  useEffect(() => {
    fetchFriends()
  }, [])

  // Перевіряємо URL параметри для автоматичного вибору друга
  useEffect(() => {
    const assignToParam = searchParams.get('assignTo')
    console.log('CreateQuestForm - URL params:', {
      assignToParam,
      allParams: Object.fromEntries(searchParams.entries())
    })
    
    if (assignToParam && assignToParam !== 'self') {
      console.log('Auto-assigning quest to:', assignToParam)
      setFormData(prev => ({
        ...prev,
        assignTo: assignToParam
      }))
    }
  }, [searchParams])

  // Логуємо зміни в formData.assignTo
  useEffect(() => {
    console.log('FormData assignTo changed:', formData.assignTo)
  }, [formData.assignTo])

  const fetchFriends = async () => {
    try {
      setLoadingFriends(true)
      const response = await fetch('/api/friends/accepted')
      if (response.ok) {
        const data = await response.json()
        setFriends(data)
        console.log('Friends loaded:', data.length, 'friends')
        
        // Перевіряємо, чи потрібно встановити assignTo після завантаження друзів
        const assignToParam = searchParams.get('assignTo')
        if (assignToParam && assignToParam !== 'self') {
          const friendExists = data.some((friend: Friend) => friend.id === assignToParam)
          console.log('Friend exists check:', {
            assignToParam,
            friendExists,
            friendIds: data.map((f: Friend) => f.id)
          })
        }
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
    } finally {
      setLoadingFriends(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Submitting quest with data:', formData)

    try {
      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Quest created successfully:', result)
        router.push('/quests/my')
      } else {
        const data = await response.json()
        setError(data.error || 'Щось пішло не так')
      }
    } catch {
      setError('Щось пішло не так')
    } finally {
      setLoading(false)
    }
  }

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
          <p className="text-gray-300 mb-4">Потрібно увійти для створення квестів</p>
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Link 
                href="/quests/my"
                className="mr-4 p-2 rounded-lg bg-theme-surface border border-theme-border hover:border-theme-primary transition-colors"
              >
                <ArrowLeftIcon size={20} className="text-theme-accent" />
              </Link>
              <h1 className="text-4xl font-bold text-gray-100 drop-shadow-lg lg:bg-transparent bg-theme-surface lg:bg-opacity-0 bg-opacity-90 px-4 py-2 rounded-lg">
                Створити Новий Квест
              </h1>
              <div className="ml-2 text-3xl text-theme-accent opacity-80">⚔️</div>
            </div>
            <p className="text-xl text-gray-300 lg:bg-transparent bg-theme-surface lg:bg-opacity-0 bg-opacity-90 px-4 py-2 rounded-lg">
              Перетвори свою справу на епічну місію!
            </p>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 border border-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative rounded-xl overflow-hidden transform transition-all duration-300">
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
              
              {/* Magical sparkles */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-200"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-theme-accent rounded-full animate-pulse animation-delay-400"></div>
            </div>
            
            {/* Card content */}
            <div className="bg-theme-surface p-6 rounded-xl relative z-10 space-y-6">
              <div>
                <label className="block text-theme-accent mb-2">Назва квесту</label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-theme p-[1px] rounded-lg overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                  </div>
                  <div className="relative bg-theme-background rounded-lg p-[1px]">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 bg-theme-background rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none transition-colors"
                      placeholder="Наприклад: Купити хліб і молоко"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-theme-accent mb-2">Опис квесту</label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-theme p-[1px] rounded-lg overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                  </div>
                  <div className="relative bg-theme-background rounded-lg p-[1px]">
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-3 bg-theme-background rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none transition-colors h-32 resize-none"
                      placeholder="Детальний опис того, що потрібно зробити..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-theme-accent mb-2">Категорія</label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-theme p-[1px] rounded-lg overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                  </div>
                  <div className="relative bg-theme-background rounded-lg p-[1px]">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 pr-8 bg-theme-background rounded-lg text-gray-100 focus:outline-none transition-colors appearance-none"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.emoji} {category.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-theme-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-theme-accent mb-2 flex items-center">
                  <SwordIcon size={14} className="mr-2" />
                  Складність
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.value}
                      type="button"
                      onClick={() => handleDifficultyChange(difficulty.value)}
                      className={`p-3 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                        formData.difficulty === difficulty.value
                          ? 'border-theme-accent bg-theme-surface shadow-lg'
                          : 'border-theme-border bg-theme-background hover:border-theme-primary'
                      }`}
                    >
                      <div className="text-2xl mb-1">{difficulty.emoji}</div>
                      <div className="text-sm font-bold text-white">{difficulty.label}</div>
                      <div className="text-xs text-gray-400">
                        {difficulty.reward} 🪙 | {difficulty.exp} ⭐
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-theme-accent mb-2 flex items-center">
                    <MapPinIcon size={14} className="mr-2" />
                    Місце виконання
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-theme p-[1px] rounded-lg overflow-hidden">
                      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                    </div>
                    <div className="relative bg-theme-background rounded-lg p-[1px]">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full p-3 bg-theme-background rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none transition-colors"
                        placeholder="Наприклад: Супермаркет, дім, офіс"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-theme-accent mb-2 flex items-center">
                    <ClockIcon size={14} className="mr-2 text-theme-accent" />
                    Дедлайн
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-theme p-[1px] rounded-lg overflow-hidden">
                      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                    </div>
                    <div className="relative bg-theme-background rounded-lg p-[1px]">
                      <input
                        type="datetime-local"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full p-3 pr-10 bg-theme-background rounded-lg text-gray-100 focus:outline-none transition-colors [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-datetime-edit]:text-gray-100"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-theme-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isUrgent"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                  className="w-4 h-4 text-theme-accent bg-theme-background border-theme-border rounded focus:ring-theme-accent"
                />
                <label htmlFor="isUrgent" className="text-gray-300">
                  Терміновий квест ⚡
                </label>
              </div>

              {/* Assign to specific hero */}
              <div>
                <label className="block text-theme-accent mb-2">Призначити квест</label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-theme p-[1px] rounded-lg overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-theme-text rounded-full animate-pulse animation-delay-300"></div>
                  </div>
                  <div className="relative bg-theme-background rounded-lg p-[1px]">
                    <select
                      value={formData.assignTo}
                      onChange={(e) => {
                        console.log('Select changed:', {
                          from: formData.assignTo,
                          to: e.target.value
                        })
                        setFormData({ ...formData, assignTo: e.target.value })
                      }}
                      className="w-full p-3 pr-8 bg-theme-background rounded-lg text-gray-100 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="self">Собі (я буду виконувати)</option>
                      {loadingFriends ? (
                        <option disabled>Завантаження друзів...</option>
                      ) : friends.length === 0 ? (
                        <option disabled>Немає друзів. Спочатку знайдіть героїв!</option>
                      ) : (
                        friends.map((friend) => (
                          <option key={friend.id} value={friend.id}>
                            Другу: {friend.heroName || friend.name} ({getHeroClassLabel(friend.heroClass || '')}) - Рівень {friend.heroLevel}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-theme-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {friends.length === 0 && !loadingFriends && (
                  <p className="text-sm text-gray-400 mt-2">
                    <Link href="/heroes" className="text-theme-accent hover:text-theme-text">
                      Знайти героїв
                    </Link> щоб призначати квести друзям
                  </p>
                )}
                {formData.assignTo === 'self' && (
                  <p className="text-sm text-emerald-400 mt-2">
                    ✅ Квест буде призначений вам і одразу стане доступним для виконання!
                  </p>
                )}
                {formData.assignTo && formData.assignTo !== 'self' && (
                  <p className="text-sm text-theme-accent mt-2">
                    📤 Квест буде надіслано вашому другу. Він зможе його прийняти!
                    {(() => {
                      const selectedFriend = friends.find(f => f.id === formData.assignTo)
                      return selectedFriend ? (
                        <span className="block mt-1 text-emerald-400">
                          Обрано: {selectedFriend.heroName || selectedFriend.name}
                        </span>
                      ) : null
                    })()}
                  </p>
                )}
              </div>

              <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
                <h3 className="text-lg font-bold text-gray-100 mb-2 flex items-center">
                  <SparklesIcon size={16} className="mr-2" />
                  Нагороди за квест
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl">🪙</div>
                    <div className="text-white font-bold">{formData.reward}</div>
                    <div className="text-gray-400 text-sm">Золото</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">⭐</div>
                    <div className="text-white font-bold">{formData.experience}</div>
                    <div className="text-gray-400 text-sm">Досвід</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-3 px-6 flex-1 bg-gradient-theme text-gray-100 hover:bg-gradient-theme-hover border border-theme-primary shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-theme-accent opacity-50 rounded-full"></span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-theme-accent opacity-50 rounded-full"></span>
                  {loading ? 'Створення...' : 'Створити Квест'}
                </button>
                <Link
                  href="/quests/my"
                  className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-3 px-6 flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-700 hover:to-gray-800 border border-gray-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gray-300 opacity-50 rounded-full"></span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gray-300 opacity-50 rounded-full"></span>
                  Скасувати
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 