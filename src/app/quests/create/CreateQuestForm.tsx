'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getHeroClassLabel } from '@/lib/heroClasses'
// Removed import of PageSkeleton due to missing module

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
    console.log('Difficulty changed:', {
      difficulty,
      selectedDifficulty,
      reward: selectedDifficulty?.reward || 0,
      experience: selectedDifficulty?.exp || 0
    })
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

  const fetchFriends = async () => {
    try {
      setLoadingFriends(true)
      const response = await fetch('/api/friends/accepted')
      if (response.ok) {
        const data = await response.json()
        setFriends(data)
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

    console.log('Submitting quest form:', {
      ...formData,
      assignToValue: formData.assignTo,
      assignToType: typeof formData.assignTo
    })

    try {
      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
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
          <p className="text-gray-300 mb-4">Потрібно увійти для створення квестів</p>
          <Link href="/auth/signin" className="text-yellow-400 hover:text-yellow-300">
            Увійти
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Створити Новий Квест
          </h1>
          <p className="text-gray-300">
            Перетвори свою справу на епічну місію!
          </p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Назва квесту</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              placeholder="Наприклад: Купити хліб і молоко"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Опис квесту</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none h-32"
              placeholder="Детальний опис того, що потрібно зробити..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Категорія</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.emoji} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Складність</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.value}
                  type="button"
                  onClick={() => handleDifficultyChange(difficulty.value)}
                  className={`p-3 rounded-lg border transition-colors ${
                    formData.difficulty === difficulty.value
                      ? 'border-yellow-400 bg-yellow-400 bg-opacity-20'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
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
              <label className="block text-gray-300 mb-2">Місце виконання</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                placeholder="Наприклад: Супермаркет, дім, офіс"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Дедлайн</label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isUrgent"
              checked={formData.isUrgent}
              onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
              className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
            />
            <label htmlFor="isUrgent" className="text-gray-300">
              Терміновий квест ⚡
            </label>
          </div>

          {/* Assign to specific hero */}
          <div>
            <label className="block text-gray-300 mb-2">Призначити квест</label>
            <select
              value={formData.assignTo}
              onChange={(e) => setFormData({ ...formData, assignTo: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
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
            {friends.length === 0 && !loadingFriends && (
              <p className="text-sm text-gray-400 mt-2">
                <Link href="/heroes" className="text-yellow-400 hover:text-yellow-300">
                  Знайти героїв
                </Link> щоб призначати квести друзям
              </p>
            )}
            {formData.assignTo === 'self' && (
              <p className="text-sm text-green-400 mt-2">
                ✅ Квест буде призначений вам і одразу стане доступним для виконання!
              </p>
            )}
            {formData.assignTo && formData.assignTo !== 'self' && (
              <p className="text-sm text-blue-400 mt-2">
                📤 Квест буде надіслано вашому другу. Він зможе його прийняти!
              </p>
            )}
          </div>

          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">Нагороди за квест</h3>
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
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Створення...' : 'Створити Квест'}
            </button>
            <Link
              href="/quests/my"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
            >
              Скасувати
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 