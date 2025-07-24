'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getClassColorPalette } from '@/lib/heroClasses'
import { applyTheme } from '@/lib/themeUtils'

export default function ThemeToggle() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [localTheme, setLocalTheme] = useState<string>('STANDARD')

  // Синхронізуємо локальну тему з сесією при завантаженні
  useEffect(() => {
    if (session?.user?.themeType) {
      setLocalTheme(session.user.themeType)
    }
  }, [session?.user?.themeType])

  const handleThemeChange = async (themeType: 'STANDARD' | 'CLASS') => {
    console.log('handleThemeChange called with:', themeType)
    if (!session || isLoading) return

    setIsLoading(true)
    try {
      console.log('Sending theme update request...')
      const response = await fetch('/api/profile/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeType }),
      })

      if (response.ok) {
        console.log('Theme updated successfully, applying...')
        
        // Застосовуємо тему одразу
        applyTheme(themeType, session.user?.heroClass)
        
        // Встановлюємо локальну тему одразу
        setLocalTheme(themeType)
        
        // Оновлюємо сесію
        await update({
          ...session,
          user: {
            ...session.user,
            themeType
          }
        })
        console.log('Session updated')
      } else {
        console.error('Failed to update theme:', response.status)
      }
    } catch (error) {
      console.error('Error updating theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentTheme = localTheme || session?.user?.themeType || 'STANDARD'
  const heroClass = session?.user?.heroClass || 'Warrior'
  const palette = getClassColorPalette(heroClass)

  return (
    <div className="bg-theme-background rounded-lg p-4 border border-theme-border">
      <h3 className="text-lg font-bold text-theme-text mb-4 flex items-center">
        <span className="mr-2">🎨</span>
        Тема інтерфейсу
      </h3>
      
      <div className="space-y-3">
        {/* Стандартна тема */}
        <div 
          className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
            currentTheme === 'STANDARD' 
              ? 'border-[#624cab] bg-[#252838]' 
              : 'border-[#4a4257] bg-[#1a1d29] hover:border-[#624cab]'
          }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleThemeChange('STANDARD')
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-100">Стандартна</h4>
              <p className="text-sm text-gray-400">Класична темна тема з фіолетовими акцентами</p>
            </div>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#624cab]"></div>
              <div className="w-3 h-3 rounded-full bg-[#a48fff]"></div>
              <div className="w-3 h-3 rounded-full bg-[#a48fff]"></div>
            </div>
          </div>
          {currentTheme === 'STANDARD' && (
            <div className="absolute top-2 right-2 text-[#a48fff]">✓</div>
          )}
        </div>

        {/* Класова тема */}
        <div 
          className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
            currentTheme === 'CLASS' 
              ? `border-[${palette.primary}] bg-[#252838]` 
              : 'border-[#4a4257] bg-[#1a1d29] hover:border-[${palette.primary}]'
          }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleThemeChange('CLASS')
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium" style={{ color: palette.primary }}>
                Класова
              </h4>
              <p className="text-sm text-gray-400">
                Тема в кольорах вашого класу: {session?.user?.heroClass || 'Warrior'}
              </p>
            </div>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.primary }}></div>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.accent }}></div>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.secondary }}></div>
            </div>
          </div>
          {currentTheme === 'CLASS' && (
            <div className="absolute top-2 right-2" style={{ color: palette.primary }}>
              ✓
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="mt-3 text-center">
          <div className="inline-block w-4 h-4 border-2 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-gray-400">Оновлення теми...</span>
        </div>
      )}
    </div>
  )
} 