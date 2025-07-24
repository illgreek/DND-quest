'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getHeroClassLabel, getHeroClassEmoji } from '@/lib/heroClasses'
import { getCurrentLevel, getNextLevel, getLevelProgress } from '@/lib/heroLevels'
import { HomeIcon, ScrollIcon, PlusIcon, UserIcon, UsersIcon, LogOutIcon, SettingsIcon } from 'lucide-react'

interface Friendship {
  id: string
  status: string
  senderId: string
  receiverId: string
}

export default function Navigation() {
  const { data: session, status, update } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchPendingRequests()
    }
  }, [session])

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch('/api/friendships')
      if (response.ok) {
        const friendships = await response.json()
        const pending = friendships.filter((f: Friendship) => 
          f.receiverId === session?.user?.id && f.status === 'PENDING'
        )
        setPendingRequests(pending)
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error)
    }
  }

  useEffect(() => {
    const handleFriendshipUpdate = () => {
      fetchPendingRequests()
    }

    const handleSessionUpdate = async () => {
      await update()
    }

    window.addEventListener('friendship-updated', handleFriendshipUpdate)
    window.addEventListener('session-updated', handleSessionUpdate)
    
    return () => {
      window.removeEventListener('friendship-updated', handleFriendshipUpdate)
      window.removeEventListener('session-updated', handleSessionUpdate)
    }
  }, [session, update])

  // Функція для визначення активної сторінки
  const isActivePage = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    // Спеціальна обробка для сторінок авторизації
    if (pathname.startsWith('/auth/')) {
      return false // Сторінки авторизації не показують активну навігацію
    }
    // Спеціальна обробка для сторінок квестів
    if (path === '/quests/my' && pathname.startsWith('/quests/')) {
      return pathname === '/quests/my' || pathname.startsWith('/quests/my/')
    }
    if (path === '/quests/create' && pathname.startsWith('/quests/')) {
      return pathname === '/quests/create' || pathname.startsWith('/quests/create/')
    }
    return pathname.startsWith(path)
  }

  // Функція для обробки виходу з перенаправленням
  const handleSignOut = async () => {
    if (isSigningOut) return // Запобігаємо повторним натисканням
    
    setIsSigningOut(true)
    try {
      // Одразу перенаправляємо на сторінку входу
      router.push('/auth/signin')
      
      // Потім виходимо з системи
      await signOut({ 
        redirect: false 
      })
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsSigningOut(false)
    }
  }



  if (status === 'loading') {
    return (
      <nav className="bg-theme-background border-r border-theme-border w-64 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 flex items-center border-b border-theme-border">
          <div className="w-10 h-10 rounded-lg bg-theme-accent flex items-center justify-center mr-3 border border-theme-primary">
            <div className="w-6 h-6 border-2 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-xl text-theme-text font-bold tracking-wider">DND Quests</h1>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-theme-background border-r border-theme-border relative z-10">
        {/* Logo area */}
        <div className="p-4 flex items-center border-b border-theme-border">
          <div className="w-10 h-10 rounded-lg bg-theme-accent flex items-center justify-center mr-3 border border-theme-primary">
            <span className="text-yellow-400 text-xl">⚔️</span>
          </div>
          <h1 className="text-xl text-theme-text font-bold tracking-wider">
            DND Quests
          </h1>
        </div>

        {/* User profile summary */}
        {session && (
          <div className="p-4 border-b border-theme-border bg-theme-surface">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-theme-primary mr-3 bg-theme-accent flex items-center justify-center">
                <span className="text-2xl">{getHeroClassEmoji(session.user.heroClass || '')}</span>
              </div>
              <div>
                <div className="text-theme-text font-bold">{session.user.heroName || session.user.name}</div>
                <div className="flex items-center text-xs text-gray-400">
                  <span>Lvl {session.user.heroLevel}</span>
                  <span className="mx-1">•</span>
                  <span>{getHeroClassLabel(session.user.heroClass || '')}</span>
                </div>
                <div className="text-xs text-theme-accent mt-1">
                  {(() => {
                    const currentLevel = getCurrentLevel(session.user.heroClass || 'Warrior', session.user.experience || 0)
                    return currentLevel.title
                  })()}
                </div>
              </div>
            </div>

            {/* XP Progress bar */}
            <div className="mt-3">
              {(() => {
                const heroClass = session.user.heroClass || 'Warrior'
                const experience = session.user.experience || 0
                const currentLevel = getCurrentLevel(heroClass, experience)
                const nextLevel = getNextLevel(heroClass, experience)
                const progress = getLevelProgress(heroClass, experience)
                
                return (
                  <>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-theme-accent">Прогрес</span>
                      <span className="text-gray-400">
                        {experience} / {nextLevel ? nextLevel.experienceRequired : currentLevel.experienceRequired} XP
                      </span>
                    </div>
                    <div className="w-full bg-theme-background rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-theme h-full rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-4 space-y-2">
            <NavButton
              icon={<HomeIcon size={20} />}
              label="Головна"
              href="/"
              isActive={isActivePage('/')}
            />
            
            {session && (
              <>
                <NavButton
                  icon={<ScrollIcon size={20} />}
                  label="Мої Квести"
                  href="/quests/my"
                  isActive={isActivePage('/quests/my')}
                />
                
                <NavButton
                  icon={<UsersIcon size={20} />}
                  label={`Герої ${pendingRequests.length > 0 ? `(${pendingRequests.length})` : ''}`}
                  href="/heroes"
                  isActive={isActivePage('/heroes')}
                  badge={pendingRequests.length}
                />
                
                <NavButton
                  icon={<PlusIcon size={20} />}
                  label="Створити Квест"
                  href="/quests/create"
                  isActive={isActivePage('/quests/create')}
                />
              </>
            )}
          </div>

          {/* Secondary Navigation */}
          {session && (
            <div className="px-4 mt-8 space-y-2">
              <div className="text-xs text-theme-accent font-medium mb-2 px-2">Акаунт</div>
              
              <NavButton
                icon={<UserIcon size={20} />}
                label="Профіль"
                href="/profile"
                isActive={isActivePage('/profile')}
              />
              
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isSigningOut 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-gray-300 hover:bg-theme-surface hover:text-theme-text'
                }`}
              >
                {isSigningOut ? (
                  <div className="w-5 h-5 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mr-3"></div>
                ) : (
                  <LogOutIcon size={20} className="mr-3 text-theme-accent" />
                )}
                {isSigningOut ? 'Вихід...' : 'Вийти'}
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-theme-background border-t border-theme-border z-50">
        <div className="flex justify-around py-2">
          <Link 
            href="/" 
            className={`flex flex-col items-center p-2 transition-colors ${
              isActivePage('/') ? 'text-theme-text bg-theme-surface rounded-md' : 'text-theme-accent'
            }`}
          >
            <HomeIcon size={20} />
            <span className="text-xs mt-1">Головна</span>
          </Link>
          
          {session && (
            <>
              <Link 
                href="/quests/my" 
                className={`flex flex-col items-center p-2 transition-colors ${
                  isActivePage('/quests/my') ? 'text-theme-text bg-theme-surface rounded-md' : 'text-theme-accent'
                }`}
              >
                <ScrollIcon size={20} />
                <span className="text-xs mt-1">Квести</span>
              </Link>
              
              <Link 
                href="/heroes" 
                className={`flex flex-col items-center p-2 transition-colors relative ${
                  isActivePage('/heroes') ? 'text-theme-text bg-theme-surface rounded-md' : 'text-theme-accent'
                }`}
              >
                <UsersIcon size={20} />
                <span className="text-xs mt-1">Герої</span>
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </Link>
              
              <Link 
                href="/quests/create" 
                className={`flex flex-col items-center p-2 transition-colors ${
                  isActivePage('/quests/create') ? 'text-theme-text bg-theme-surface rounded-md' : 'text-theme-accent'
                }`}
              >
                <PlusIcon size={20} />
                <span className="text-xs mt-1">Створити</span>
              </Link>
              
              <Link 
                href="/profile" 
                className={`flex flex-col items-center p-2 transition-colors ${
                  isActivePage('/profile') ? 'text-theme-text bg-theme-surface rounded-md' : 'text-theme-accent'
                }`}
              >
                <UserIcon size={20} />
                <span className="text-xs mt-1">Профіль</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  href: string
  isActive: boolean
  badge?: number
}

function NavButton({ icon, label, href, isActive, badge }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors relative ${
        isActive 
          ? 'bg-theme-surface text-theme-text border border-theme-primary' 
          : 'text-gray-300 hover:bg-theme-surface hover:text-theme-text'
      }`}
    >
      <span className="mr-3 text-theme-accent">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
} 