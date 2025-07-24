'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { getHeroClassLabel, getHeroClassEmoji } from '@/lib/heroClasses'
import { HomeIcon, ScrollIcon, PlusIcon, UserIcon, UsersIcon, LogOutIcon, SettingsIcon } from 'lucide-react'

interface Friendship {
  id: string
  status: string
  senderId: string
  receiverId: string
}

export default function Navigation() {
  const { data: session, status } = useSession()
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

    window.addEventListener('friendship-updated', handleFriendshipUpdate)
    return () => window.removeEventListener('friendship-updated', handleFriendshipUpdate)
  }, [session])

  if (status === 'loading') {
    return (
      <nav className="bg-[#10131c] border-r border-[#4a4257] w-64 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 flex items-center border-b border-[#4a4257]">
          <div className="w-10 h-10 rounded-lg bg-[#3d2b6b] flex items-center justify-center mr-3 border border-[#624cab]">
            <div className="w-6 h-6 border-2 border-[#a48fff] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-xl text-[#d4c6ff] font-bold tracking-wider">DND Quests</h1>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-[#10131c] border-r border-[#4a4257] relative z-10">
        {/* Logo area */}
        <div className="p-4 flex items-center border-b border-[#4a4257]">
          <div className="w-10 h-10 rounded-lg bg-[#3d2b6b] flex items-center justify-center mr-3 border border-[#624cab]">
            <span className="text-yellow-400 text-xl">⚔️</span>
          </div>
          <h1 className="text-xl text-[#d4c6ff] font-bold tracking-wider">
            DND Quests
          </h1>
        </div>

        {/* User profile summary */}
        {session && (
          <div className="p-4 border-b border-[#4a4257] bg-[#141824]">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#624cab] mr-3 bg-[#3d2b6b] flex items-center justify-center">
                <span className="text-2xl">{getHeroClassEmoji(session.user.heroClass || '')}</span>
              </div>
              <div>
                <div className="text-[#d4c6ff] font-bold">{session.user.heroName || session.user.name}</div>
                <div className="flex items-center text-xs text-gray-400">
                  <span>Lvl {session.user.heroLevel}</span>
                  <span className="mx-1">•</span>
                  <span>{getHeroClassLabel(session.user.heroClass || '')}</span>
                </div>
              </div>
            </div>

            {/* XP Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a48fff]">Прогрес</span>
                <span className="text-gray-400">{session.user.experience || 0} / 100 XP</span>
              </div>
              <div className="w-full bg-[#1a1d29] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#624cab] to-[#a48fff] h-full rounded-full" 
                  style={{ width: `${Math.min(((session.user.experience || 0) / 100) * 100, 100)}%` }}
                ></div>
              </div>
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
              isActive={true}
            />
            
            {session && (
              <>
                <NavButton
                  icon={<ScrollIcon size={20} />}
                  label="Мої Квести"
                  href="/quests/my"
                  isActive={false}
                />
                
                <NavButton
                  icon={<UsersIcon size={20} />}
                  label={`Герої ${pendingRequests.length > 0 ? `(${pendingRequests.length})` : ''}`}
                  href="/heroes"
                  isActive={false}
                  badge={pendingRequests.length}
                />
                
                <NavButton
                  icon={<PlusIcon size={20} />}
                  label="Створити Квест"
                  href="/quests/create"
                  isActive={false}
                />
              </>
            )}
          </div>

          {/* Secondary Navigation */}
          {session && (
            <div className="px-4 mt-8 space-y-2">
              <div className="text-xs text-[#a48fff] font-medium mb-2 px-2">Акаунт</div>
              
              <NavButton
                icon={<UserIcon size={20} />}
                label="Профіль"
                href="/profile"
                isActive={false}
              />
              
              <button
                onClick={() => signOut()}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#2a2d3d] hover:text-[#d4c6ff] rounded-md transition-colors"
              >
                <LogOutIcon size={20} className="mr-3 text-[#a48fff]" />
                Вийти
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#10131c] border-t border-[#4a4257] z-50">
        <div className="flex justify-around py-2">
          <Link href="/" className="flex flex-col items-center p-2 text-[#a48fff]">
            <HomeIcon size={20} />
            <span className="text-xs mt-1">Головна</span>
          </Link>
          
          {session && (
            <>
              <Link href="/quests/my" className="flex flex-col items-center p-2 text-[#a48fff]">
                <ScrollIcon size={20} />
                <span className="text-xs mt-1">Квести</span>
              </Link>
              
              <Link href="/heroes" className="flex flex-col items-center p-2 text-[#a48fff] relative">
                <UsersIcon size={20} />
                <span className="text-xs mt-1">Герої</span>
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </Link>
              
              <Link href="/quests/create" className="flex flex-col items-center p-2 text-[#a48fff]">
                <PlusIcon size={20} />
                <span className="text-xs mt-1">Створити</span>
              </Link>
              
              <Link href="/profile" className="flex flex-col items-center p-2 text-[#a48fff]">
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
          ? 'bg-[#2a2d3d] text-[#d4c6ff] border border-[#624cab]' 
          : 'text-gray-300 hover:bg-[#2a2d3d] hover:text-[#d4c6ff]'
      }`}
    >
      <span className="mr-3 text-[#a48fff]">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
} 