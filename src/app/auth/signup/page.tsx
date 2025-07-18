'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { heroClasses } from '@/lib/heroClasses'
// import { AuthSkeleton } from '@/components/Skeleton'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    heroName: '',
    heroClass: 'Warrior'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const heroClassesList = [
    { value: 'Warrior', label: 'Воїн', emoji: '⚔️' },
    { value: 'Mage', label: 'Маг', emoji: '🔮' },
    { value: 'Rogue', label: 'Розбійник', emoji: '🗡️' },
    { value: 'Cleric', label: 'Жрець', emoji: '⛪' },
    { value: 'Ranger', label: 'Рейнджер', emoji: '🏹' },
    { value: 'Paladin', label: 'Паладін', emoji: '🛡️' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/auth/signin?message=Account created successfully')
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            Створити Героя
          </h1>
          <p className="text-gray-300">
            Приєднуйся до епічних пригод!
          </p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Ім'я</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 pr-12 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Ім'я Героя</label>
            <input
              type="text"
              value={formData.heroName}
              onChange={(e) => setFormData({ ...formData, heroName: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Клас Героя</label>
            <select
              value={formData.heroClass}
              onChange={(e) => setFormData({ ...formData, heroClass: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
            >
              {heroClassesList.map((heroClass) => (
                <option key={heroClass.value} value={heroClass.value}>
                  {heroClass.emoji} {heroClass.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Створення...' : 'Створити Героя'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-300">
            Вже маєш героя?{' '}
            <Link href="/auth/signin" className="text-yellow-400 hover:text-yellow-300">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 