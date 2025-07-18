import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const questId = resolvedParams.id
    const userId = session.user.id

    // Check if quest exists and user is the receiver
    const quest = await prisma.quest.findUnique({
      where: { id: questId }
    })

    if (!quest) {
      return NextResponse.json(
        { error: 'Квест не знайдено' },
        { status: 404 }
      )
    }

    if (quest.receiverId !== userId) {
      return NextResponse.json(
        { error: 'Тільки виконавець квесту може його завершити' },
        { status: 403 }
      )
    }

    if (quest.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Квест не в процесі виконання' },
        { status: 400 }
      )
    }

    // Use transaction to update quest and user rewards
    const result = await prisma.$transaction(async (tx: any) => {
      // Update quest status
      const updatedQuest = await tx.quest.update({
        where: { id: questId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      // Update user rewards
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          gold: {
            increment: quest.reward
          },
          experience: {
            increment: quest.experience
          }
        }
      })

      // Check if user leveled up (every 100 XP = 1 level)
      const newLevel = Math.floor(updatedUser.experience / 100) + 1
      let finalUser = updatedUser

      if (newLevel > updatedUser.heroLevel) {
        finalUser = await tx.user.update({
          where: { id: userId },
          data: {
            heroLevel: newLevel
          }
        })
      }

      return { 
        quest: updatedQuest, 
        user: finalUser,
        rewards: {
          gold: quest.reward,
          experience: quest.experience,
          levelUp: newLevel > updatedUser.heroLevel
        }
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Complete quest error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 