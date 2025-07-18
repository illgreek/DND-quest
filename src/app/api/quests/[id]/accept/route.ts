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

    // Check if quest exists and is available
    const quest = await prisma.quest.findUnique({
      where: { id: questId }
    })

    if (!quest) {
      return NextResponse.json(
        { error: 'Квест не знайдено' },
        { status: 404 }
      )
    }

    if (quest.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Квест недоступний для прийняття' },
        { status: 400 }
      )
    }

    if (quest.creatorId === userId) {
      return NextResponse.json(
        { error: 'Не можна прийняти власний квест' },
        { status: 400 }
      )
    }

    // Accept the quest
    const updatedQuest = await prisma.quest.update({
      where: { id: questId },
      data: {
        status: 'IN_PROGRESS',
        receiverId: userId,
        acceptedAt: new Date()
      }
    })

    return NextResponse.json(updatedQuest)
  } catch (error) {
    console.error('Accept quest error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 