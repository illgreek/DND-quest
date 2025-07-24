'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import TutorialModal from './TutorialModal'
import { getHeroClassLabel, getHeroClassEmoji } from '@/lib/heroClasses'
import { SwordIcon, UsersIcon, TrophyIcon, SparklesIcon } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !session.user.hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-4 border-transparent border-t-[#a48fff] border-r-[#624cab] rounded-full"></div>
            </div>
            <div className="absolute inset-2 bg-[#252838] rounded-full flex items-center justify-center">
              <span className="text-[#a48fff] text-xs font-bold">⚔️</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#d4c6ff] mb-2">
            Завантаження пригод...
          </h2>
          <p className="text-gray-300">
            Готуємо світ для твоїх героїв
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#1a1b26] text-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        {/* Floating magical orbs - more spread out and darker */}
        <div className="absolute top-32 left-8 w-2 h-2 bg-[#624cab] rounded-full opacity-15 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-16 right-12 w-1 h-1 bg-[#a48fff] rounded-full opacity-20 animate-pulse animation-delay-1500"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-[#3d2b6b] rounded-full opacity-10 animate-pulse animation-delay-800"></div>
        <div className="absolute bottom-16 right-8 w-1 h-1 bg-[#d4c6ff] rounded-full opacity-15 animate-pulse animation-delay-1200"></div>
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-[#624cab] rounded-full opacity-12 animate-pulse animation-delay-600"></div>
        <div className="absolute top-3/4 right-1/6 w-2 h-2 bg-[#a48fff] rounded-full opacity-8 animate-pulse animation-delay-900"></div>
        
        {/* Mystical runes and symbols - more spread out and darker */}
        <div className="absolute top-24 left-1/4 text-[#624cab] opacity-6 text-4xl font-bold">⚔️</div>
        <div className="absolute bottom-24 right-1/3 text-[#a48fff] opacity-5 text-3xl">🏰</div>
        <div className="absolute top-1/3 left-12 text-[#3d2b6b] opacity-8 text-2xl">🗡️</div>
        <div className="absolute bottom-1/4 right-12 text-[#d4c6ff] opacity-7 text-3xl">🛡️</div>
        
        {/* Subtle grid pattern - even more subtle */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
          
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#624cab] to-transparent"></div>
        </div>
        
        {/* Corner decorative elements - thinner and darker */}
        <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-[#624cab] opacity-12"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-[#624cab] opacity-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-[#624cab] opacity-12"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-[#624cab] opacity-12"></div>
        
        {/* Floating particles - more spread out and darker */}
        <div className="absolute top-20 left-1/4 w-1 h-1 bg-[#a48fff] rounded-full opacity-10 animate-pulse animation-delay-300"></div>
        <div className="absolute top-28 right-1/5 w-1 h-1 bg-[#d4c6ff] rounded-full opacity-8 animate-pulse animation-delay-700"></div>
        <div className="absolute bottom-20 left-1/5 w-1 h-1 bg-[#624cab] rounded-full opacity-12 animate-pulse animation-delay-500"></div>
        <div className="absolute bottom-28 right-1/4 w-1 h-1 bg-[#a48fff] rounded-full opacity-6 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-[#d4c6ff] rounded-full opacity-9 animate-pulse animation-delay-400"></div>
        <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-[#624cab] rounded-full opacity-11 animate-pulse animation-delay-800"></div>
        
        {/* Additional mystical elements - more central and darker */}
        <div className="absolute top-1/5 left-1/6 text-[#3d2b6b] opacity-5 text-xl">⚜️</div>
        <div className="absolute top-10 left-24 text-[#624cab] opacity-6 text-2xl">🔮</div>
        <div className="absolute top-2/3 left-1/4 text-[#a48fff] opacity-4 text-lg">⚡</div>
        <div className="absolute bottom-2/3 right-1/4 text-[#d4c6ff] opacity-5 text-xl">🌟</div>
        
        {/* Subtle corner runes - smaller and darker */}
        <div className="absolute top-6 left-6 text-[#624cab] opacity-8 text-sm">⚔</div>
        <div className="absolute top-6 right-6 text-[#a48fff] opacity-6 text-sm">🛡</div>
        <div className="absolute bottom-6 left-6 text-[#3d2b6b] opacity-7 text-sm">⚜</div>
        <div className="absolute bottom-6 right-6 text-[#d4c6ff] opacity-9 text-sm">🗡</div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-6xl font-bold text-[#d4c6ff] drop-shadow-lg">
                DND Quests
              </h1>
              <div className="ml-2 text-4xl text-[#a48fff] opacity-80">⚔️</div>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Перетвори свої щоденні справи на епічні квести! 
              Створюй завдання, знаходь героїв та виконуй місії разом з друзями.
            </p>
            
            {session ? (
              <div className="space-y-4">
                <div className="relative mb-4 rounded-lg overflow-hidden max-w-4xl mx-auto">
                  {/* Decorative border with magical effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                    {/* Top-right corner decoration */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-bl-lg border-b border-l border-[#7a63d4]">
                      <SparklesIcon size={14} className="text-[#a48fff]" />
                    </div>
                    {/* Top-left corner decoration */}
                    <div className="absolute top-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-br-lg border-b border-r border-[#7a63d4]">
                      <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                    </div>
                    {/* Bottom-right corner decoration */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tl-lg border-t border-l border-[#7a63d4]">
                      <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                    </div>
                    {/* Bottom-left corner decoration */}
                    <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tr-lg border-t border-r border-[#7a63d4]">
                      <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                    </div>
                    {/* Magical sparkles - edge decorations */}
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                    <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-500"></div>
                    
                    {/* Additional edge decorations */}
                    <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                    <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                    <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
                    
                    {/* Middle edge decorations */}
                    <div className="absolute top-1/2 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                    <div className="absolute top-1/2 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-700"></div>
                    <div className="absolute left-1/2 top-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                    <div className="absolute left-1/2 bottom-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-500"></div>
                    
                    {/* Quarter edge decorations */}
                    <div className="absolute top-1/4 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-150"></div>
                    <div className="absolute top-1/4 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-450"></div>
                    <div className="absolute bottom-1/4 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-250"></div>
                    <div className="absolute bottom-1/4 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-550"></div>
                    
                    {/* Diagonal sparkles */}
                    <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                    <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                    <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-300"></div>
                    <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
                    
                    {/* Floating sparkles */}
                    <div className="absolute top-3 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-200"></div>
                    <div className="absolute top-3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-500"></div>
                    <div className="absolute bottom-3 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-350"></div>
                    <div className="absolute bottom-3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-650"></div>
                    
                    {/* Corner sparkles */}
                    <div className="absolute top-4 left-4 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                    <div className="absolute top-4 right-4 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-500"></div>
                  </div>
                  {/* Card content */}
                  <div className="bg-[#252838] p-6 rounded-lg relative z-10">
                    {/* Inner decorative sparkles */}
                    <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                    <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-300"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                    <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                    
                    <h2 className="text-2xl font-bold text-[#d4c6ff] mb-3 text-center">
                      Вітаємо, {session.user.heroName || session.user.name}! ⚔️
                    </h2>
                    <p className="text-gray-300 mb-4 text-center text-lg">
                      Рівень: <span className="text-[#a48fff] font-bold">{session.user.heroLevel}</span> | 
                      Клас: <span className="text-[#a48fff] font-bold">{getHeroClassLabel(session.user.heroClass || '') || 'Новичок'}</span>
                    </p>
                    
                    {/* Decorative divider */}
                    <div className="relative h-[1px] my-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#624cab] to-transparent"></div>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#252838] rounded-full flex items-center justify-center">
                        <SparklesIcon size={10} className="text-[#a48fff]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Link 
                        href="/quests/my"
                        className="relative font-medium tracking-wide rounded-md flex items-center justify-center text-sm py-3 px-4 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                        Мої Квести
                      </Link>
                      <Link 
                        href="/heroes"
                        className="relative font-medium tracking-wide rounded-md flex items-center justify-center text-sm py-3 px-4 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                        Знайти Героїв
                      </Link>
                      <Link 
                        href="/quests/create"
                        className="relative font-medium tracking-wide rounded-md flex items-center justify-center text-sm py-3 px-4 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                        Створити Квест
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/auth/signin"
                    className="relative font-medium tracking-wide rounded-md flex items-center justify-center py-4 px-8 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                    Увійти ⚔️
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="relative font-medium tracking-wide rounded-md flex items-center justify-center py-4 px-8 bg-gradient-to-r from-[#624cab] to-[#3d2b6b] text-gray-100 hover:from-[#6f55c0] hover:to-[#4a357e] border border-[#7a63d4] shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#a48fff] opacity-50 rounded-full"></span>
                    Створити Героя 🛡️
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="relative mb-4 rounded-lg overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] active:scale-[0.98]">
              {/* Decorative border with magical effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                {/* Top-right corner decoration */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-bl-lg border-b border-l border-[#7a63d4]">
                  <SwordIcon size={14} className="text-[#a48fff]" />
                </div>
                {/* Top-left corner decoration */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-br-lg border-b border-r border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Bottom-right corner decoration */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tl-lg border-t border-l border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Bottom-left corner decoration */}
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tr-lg border-t border-r border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Magical sparkles - edge decorations */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                
                {/* Additional edge decorations */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
                
                {/* Middle edge decorations */}
                <div className="absolute top-1/2 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-700"></div>
                <div className="absolute left-1/2 top-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute left-1/2 bottom-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-500"></div>
                
                {/* Quarter edge decorations */}
                <div className="absolute top-1/4 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-150"></div>
                <div className="absolute top-1/4 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-450"></div>
                <div className="absolute bottom-1/4 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-250"></div>
                <div className="absolute bottom-1/4 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-550"></div>
                
                {/* Diagonal sparkles */}
                <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
              </div>
              {/* Card content */}
              <div className="bg-[#252838] p-8 rounded-lg relative z-10 text-center">
                {/* Inner decorative sparkles */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                
                <div className="text-5xl mb-6">⚔️</div>
                <h3 className="text-xl font-bold text-[#d4c6ff] mb-4">Створюй Квести</h3>
                <p className="text-gray-300 leading-relaxed">
                  Перетвори будь-яку справу на епічну місію з нагородами та досвідом
                </p>
              </div>
            </div>
            
            <div className="relative mb-4 rounded-lg overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] active:scale-[0.98]">
              {/* Decorative border with magical effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                {/* Top-right corner decoration */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-bl-lg border-b border-l border-[#7a63d4]">
                  <UsersIcon size={14} className="text-[#a48fff]" />
                </div>
                {/* Top-left corner decoration */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-br-lg border-b border-r border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Bottom-right corner decoration */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tl-lg border-t border-l border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Bottom-left corner decoration */}
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tr-lg border-t border-r border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Magical sparkles - edge decorations */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                
                {/* Additional edge decorations */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
                
                {/* Middle edge decorations */}
                <div className="absolute top-1/2 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-700"></div>
                <div className="absolute left-1/2 top-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute left-1/2 bottom-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-500"></div>
                
                {/* Quarter edge decorations */}
                <div className="absolute top-1/4 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-150"></div>
                <div className="absolute top-1/4 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-450"></div>
                <div className="absolute bottom-1/4 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-250"></div>
                <div className="absolute bottom-1/4 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-550"></div>
                
                {/* Diagonal sparkles */}
                <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
              </div>
              {/* Card content */}
              <div className="bg-[#252838] p-8 rounded-lg relative z-10 text-center">
                {/* Inner decorative sparkles */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                
                <div className="text-5xl mb-6">👥</div>
                <h3 className="text-xl font-bold text-[#d4c6ff] mb-4">Знаходь Героїв</h3>
                <p className="text-gray-300 leading-relaxed">
                  Додавай друзів та делегуй квести тим, хто може їх виконати
                </p>
              </div>
            </div>
            
            <div className="relative mb-4 rounded-lg overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] active:scale-[0.98]">
              {/* Decorative border with magical effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a4257] via-[#624cab] to-[#3d2b6b] p-[1px] rounded-lg overflow-hidden">
                {/* Top-right corner decoration */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-bl-lg border-b border-l border-[#7a63d4]">
                  <TrophyIcon size={14} className="text-[#a48fff]" />
                </div>
                {/* Top-left corner decoration */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-br-lg border-b border-r border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Bottom-right corner decoration */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tl-lg border-t border-l border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Bottom-left corner decoration */}
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#3d2b6b] flex items-center justify-center rounded-tr-lg border-t border-r border-[#7a63d4]">
                  <div className="w-2 h-2 bg-[#a48fff] rounded-full opacity-60"></div>
                </div>
                {/* Magical sparkles - edge decorations */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                
                {/* Additional edge decorations */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
                
                {/* Middle edge decorations */}
                <div className="absolute top-1/2 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-700"></div>
                <div className="absolute left-1/2 top-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute left-1/2 bottom-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-500"></div>
                
                {/* Quarter edge decorations */}
                <div className="absolute top-1/4 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-150"></div>
                <div className="absolute top-1/4 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-450"></div>
                <div className="absolute bottom-1/4 left-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-250"></div>
                <div className="absolute bottom-1/4 right-2 w-1 h-1 bg-[#d4c6ff] rounded-full animate-pulse animation-delay-550"></div>
                
                {/* Diagonal sparkles */}
                <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-600"></div>
              </div>
              {/* Card content */}
              <div className="bg-[#252838] p-8 rounded-lg relative z-10 text-center">
                {/* Inner decorative sparkles */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-100"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-200"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-[#a48fff] rounded-full animate-pulse animation-delay-400"></div>
                
                <div className="text-5xl mb-6">🏆</div>
                <h3 className="text-xl font-bold text-[#d4c6ff] mb-4">Заробляй Нагороди</h3>
                <p className="text-gray-300 leading-relaxed">
                  Отримуй золото, досвід та підвищуй свій рівень героя
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TutorialModal 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </>
  )
} 