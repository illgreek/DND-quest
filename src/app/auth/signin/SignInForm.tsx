'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon, SwordIcon, SparklesIcon } from 'lucide-react'

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
    <div className="relative rounded-xl overflow-hidden transform transition-all duration-300">
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
      <div className="bg-[#252838] p-8 rounded-xl relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg border border-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#a48fff] mb-2 flex items-center">
              <UserIcon size={16} className="mr-2" />
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
              </div>
              <div className="relative bg-[#1a1d29] rounded-lg p-[1px]">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-[#1a1d29] border border-[#4a4257] rounded-lg text-gray-100 placeholder-gray-400 focus:border-[#624cab] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#a48fff] mb-2 flex items-center">
              <LockIcon size={16} className="mr-2" />
              Пароль
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
              </div>
              <div className="relative bg-[#1a1d29] rounded-lg p-[1px]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 pr-12 bg-[#1a1d29] border border-[#4a4257] rounded-lg text-gray-100 placeholder-gray-400 focus:border-[#624cab] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a48fff] hover:text-[#d4c6ff] z-10"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative font-medium tracking-wide rounded-lg flex items-center justify-center text-sm py-3 px-6 w-full bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
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