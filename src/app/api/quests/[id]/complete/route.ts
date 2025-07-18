import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCurrentLevel, canLevelUp } from '@/lib/heroLevels'

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

    console.log('Quest data:', {
      id: quest?.id,
      title: quest?.title,
      reward: quest?.reward,
      experience: quest?.experience,
      status: quest?.status,
      receiverId: quest?.receiverId,
      userId: userId
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
      console.log('Updating user rewards:', {
        userId,
        questReward: quest.reward,
        questExperience: quest.experience
      })
      
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          gold: {
            increment: quest.reward
          },
          experience: {
            increment: quest.experience
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          heroName: true,
          heroClass: true,
          heroLevel: true,
          experience: true,
          gold: true,
          hasSeenTutorial: true
        }
      })

      console.log('Updated user data:', {
        userId: updatedUser.id,
        newGold: updatedUser.gold,
        newExp: updatedUser.experience,
        oldGold: updatedUser.gold - quest.reward,
        oldExp: updatedUser.experience - quest.experience
      })

      // Check if user leveled up using our level system
      const currentLevel = getCurrentLevel(updatedUser.heroClass || 'Warrior', updatedUser.experience)
      const leveledUp = canLevelUp(updatedUser.heroClass || 'Warrior', updatedUser.experience)
      let finalUser = updatedUser

      if (leveledUp) {
        finalUser = await tx.user.update({
          where: { id: userId },
          data: {
            heroLevel: currentLevel.level
          },
          select: {
            id: true,
            name: true,
            email: true,
            heroName: true,
            heroClass: true,
            heroLevel: true,
            experience: true,
            gold: true,
            hasSeenTutorial: true
          }
        })
      }

      return { 
        quest: updatedQuest, 
        user: finalUser,
        rewards: {
          gold: quest.reward,
          experience: quest.experience,
          levelUp: leveledUp
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