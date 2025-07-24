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

    // Get current user data before update
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        experience: true,
        gold: true,
        heroLevel: true
      }
    })

    console.log('Current user data before update:', {
      userId: currentUser?.id,
      currentExperience: currentUser?.experience,
      currentGold: currentUser?.gold,
      currentLevel: currentUser?.heroLevel
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
      
      // Calculate expected values
      const expectedExperience = (currentUser?.experience || 0) + quest.experience
      const expectedGold = (currentUser?.gold || 0) + quest.reward
      
      console.log('Expected values:', {
        currentExp: currentUser?.experience || 0,
        questExp: quest.experience,
        expectedExp: expectedExperience,
        currentGold: currentUser?.gold || 0,
        questReward: quest.reward,
        expectedGold: expectedGold
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
        expectedExp: expectedExperience,
        expectedGold: expectedGold,
        questExp: quest.experience,
        oldExp: currentUser?.experience,
        goldDifference: updatedUser.gold - (currentUser?.gold || 0),
        expDifference: updatedUser.experience - (currentUser?.experience || 0)
      })

      // Check if user leveled up using our level system
      const currentLevel = getCurrentLevel(updatedUser.heroClass || 'Warrior', updatedUser.experience)
      const leveledUp = canLevelUp(updatedUser.heroClass || 'Warrior', updatedUser.experience)
      
      console.log('Level calculation:', {
        heroClass: updatedUser.heroClass,
        experience: updatedUser.experience,
        currentLevel: currentLevel.level,
        currentLevelTitle: currentLevel.title,
        leveledUp,
        shouldBeLevel: currentLevel.level
      })
      
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
        
        console.log('User leveled up to:', finalUser.heroLevel)
      } else {
        // Навіть якщо не leveledUp, оновлюємо рівень на правильний
        if (finalUser.heroLevel !== currentLevel.level) {
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
          
          console.log('Updated user level to:', finalUser.heroLevel)
        }
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