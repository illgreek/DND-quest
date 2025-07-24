'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { applyTheme } from '@/lib/themeUtils'

// Компонент для застосування теми
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    // Застосовуємо тему тільки при початковому завантаженні
    // або коли змінюється heroClass (але не themeType)
    if (session?.user?.themeType && session?.user?.heroClass) {
      console.log('ThemeProvider: Applying theme on mount or heroClass change')
      applyTheme(session.user.themeType, session.user.heroClass)
    }
  }, [session?.user?.heroClass]) // Тільки при зміні heroClass

  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
} 