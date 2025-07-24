'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon, SwordIcon, ShieldIcon, SparklesIcon } from 'lucide-react'
import { heroClasses } from '@/lib/heroClasses'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    heroName: '',
    heroClass: 'Warrior'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        router.push('/auth/signin?message=Герой успішно створений! Тепер можете увійти.')
      } else {
        const data = await response.json()
        setError(data.error || 'Помилка створення акаунту')
      }
    } catch (error) {
      setError('Щось пішло не так')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#d4c6ff] mb-2">
            Створити Героя
          </h1>
          <p className="text-gray-300">
            Приєднуйся до епічних пригод!
          </p>
        </div>

        <div className="card-magical-border">
          <div className="card-magical-content p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-600 text-white p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[#a48fff] mb-2 flex items-center">
                  <UserIcon size={16} className="mr-2" />
                  Ім'я
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-magical w-full p-3 rounded-lg"
                  placeholder="Ваше ім'я"
                  required
                />
              </div>

              <div>
                <label className="block text-[#a48fff] mb-2 flex items-center">
                  <UserIcon size={16} className="mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-magical w-full p-3 rounded-lg"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[#a48fff] mb-2 flex items-center">
                  <LockIcon size={16} className="mr-2" />
                  Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-magical w-full p-3 pr-12 rounded-lg"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a48fff] hover:text-[#d4c6ff]"
                  >
                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#a48fff] mb-2 flex items-center">
                  <SwordIcon size={16} className="mr-2" />
                  Ім'я героя
                </label>
                <input
                  type="text"
                  value={formData.heroName}
                  onChange={(e) => setFormData({ ...formData, heroName: e.target.value })}
                  className="input-magical w-full p-3 rounded-lg"
                  placeholder="Епічне ім'я героя"
                  required
                />
              </div>

              <div>
                <label className="block text-[#a48fff] mb-2 flex items-center">
                  <ShieldIcon size={16} className="mr-2" />
                  Клас героя
                </label>
                <select
                  value={formData.heroClass}
                  onChange={(e) => setFormData({ ...formData, heroClass: e.target.value })}
                  className="input-magical w-full p-3 rounded-lg"
                >
                  {Object.entries(heroClasses).map(([key, heroClass]) => (
                    <option key={key} value={key}>
                      {heroClass.emoji} {heroClass.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hero Class Preview */}
              <div className="bg-[#1a1d29] rounded-lg p-4 border border-[#4a4257]">
                <h3 className="text-lg font-bold text-[#d4c6ff] mb-2 flex items-center">
                  <SparklesIcon size={16} className="mr-2" />
                  Обраний клас
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {heroClasses[formData.heroClass as keyof typeof heroClasses]?.emoji}
                  </div>
                  <div>
                    <div className="text-[#a48fff] font-bold">
                      {heroClasses[formData.heroClass as keyof typeof heroClasses]?.label}
                    </div>
                    <div className="text-sm text-gray-400">
                      Клас героя
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 border border-emerald-500"
              >
                {loading ? 'Створення...' : 'Створити героя'}
              </button>

              <div className="text-center">
                <p className="text-gray-300">
                  Вже є герой?{' '}
                  <Link href="/auth/signin" className="text-[#a48fff] hover:text-[#d4c6ff] font-medium">
                    Увійти
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 