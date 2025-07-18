import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get quest statistics
    const [totalQuests, completedQuests, user] = await Promise.all([
      // Total quests created by user
      prisma.quest.count({
        where: { creatorId: userId }
      }),
      
      // Completed quests by user
      prisma.quest.count({
        where: { 
          receiverId: userId,
          status: 'COMPLETED'
        }
      }),
      
      // User data for gold and experience
      prisma.user.findUnique({
        where: { id: userId },
        select: { gold: true, experience: true }
      })
    ])

    // Get friends count
    const friendsCount = await prisma.friendship.count({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ],
        status: 'ACCEPTED'
      }
    })

    const stats = {
      totalQuests,
      completedQuests,
      totalGold: user?.gold || 0,
      totalExperience: user?.experience || 0,
      friendsCount
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('GET profile stats error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 