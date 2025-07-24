'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon, SwordIcon, ShieldIcon, SparklesIcon } from 'lucide-react'
import { heroClasses, getClassColorPalette } from '@/lib/heroClasses'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    heroName: '',
    heroClass: 'Warrior',
    themeType: 'STANDARD'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Submitting signup form:', formData)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Signup successful:', result)
        router.push('/auth/signin?message=Герой успішно створений! Тепер можете увійти.')
      } else {
        const data = await response.json()
        console.error('Signup error:', data)
        setError(data.error || 'Помилка створення акаунту')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError('Щось пішло не так')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
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
                <label className="block text-theme-accent mb-2 flex items-center">
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
                <label className="block text-theme-accent mb-2 flex items-center">
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
                <label className="block text-theme-accent mb-2 flex items-center">
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-accent hover:text-gray-100"
                  >
                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-theme-accent mb-2 flex items-center">
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
                <label className="block text-theme-accent mb-2 flex items-center">
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
              <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
                <h3 className="text-lg font-bold text-gray-100 mb-2 flex items-center">
                  <SparklesIcon size={16} className="mr-2" />
                  Обраний клас
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {heroClasses[formData.heroClass as keyof typeof heroClasses]?.emoji}
                  </div>
                  <div>
                    <div className="text-theme-accent font-bold">
                      {heroClasses[formData.heroClass as keyof typeof heroClasses]?.label}
                    </div>
                    <div className="text-sm text-gray-400">
                      Клас героя
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-theme-accent mb-2 flex items-center">
                  <span className="mr-2">🎨</span>
                  Тема інтерфейсу
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-theme-background rounded-lg border border-theme-border cursor-pointer hover:border-theme-primary transition-colors">
                    <input
                      type="radio"
                      name="themeType"
                      value="STANDARD"
                      checked={formData.themeType === 'STANDARD'}
                      onChange={(e) => setFormData({ ...formData, themeType: e.target.value as 'STANDARD' | 'CLASS' })}
                      className="mr-3 text-theme-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-100">Стандартна</div>
                      <div className="text-sm text-gray-400">Класична темна тема з фіолетовими акцентами</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-theme-primary"></div>
                      <div className="w-3 h-3 rounded-full bg-theme-accent"></div>
                      <div className="w-3 h-3 rounded-full bg-theme-accent"></div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 bg-theme-background rounded-lg border border-theme-border cursor-pointer hover:border-theme-primary transition-colors">
                    <input
                      type="radio"
                      name="themeType"
                      value="CLASS"
                      checked={formData.themeType === 'CLASS'}
                      onChange={(e) => setFormData({ ...formData, themeType: e.target.value as 'STANDARD' | 'CLASS' })}
                      className="mr-3 text-theme-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-100">Класова</div>
                      <div className="text-sm text-gray-400">Тема в кольорах вашого класу: {heroClasses[formData.heroClass as keyof typeof heroClasses]?.label}</div>
                    </div>
                    <div className="flex space-x-1">
                      {(() => {
                        const palette = getClassColorPalette(formData.heroClass)
                        return (
                          <>
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: palette.primary }}
                            ></div>
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: palette.accent }}
                            ></div>
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: palette.secondary }}
                            ></div>
                          </>
                        )
                      })()}
                    </div>
                  </label>
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
                  <Link href="/auth/signin" className="text-theme-accent hover:text-gray-100 font-medium">
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