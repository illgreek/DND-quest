'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon, SwordIcon } from 'lucide-react'

export default function SignInForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError('Невірний email або пароль')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError('Щось пішло не так')
    } finally {
      setLoading(false)
    }
  }

  return (
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

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>

          <div className="text-center">
            <p className="text-gray-300">
              Немає акаунту?{' '}
              <Link href="/auth/signup" className="text-[#a48fff] hover:text-[#d4c6ff] font-medium">
                Створити героя
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 