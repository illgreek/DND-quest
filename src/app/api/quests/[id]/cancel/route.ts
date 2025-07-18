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

    // Знаходимо квест
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
      include: {
        creator: true,
        receiver: true
      }
    })

    if (!quest) {
      return NextResponse.json(
        { error: 'Квест не знайдено' },
        { status: 404 }
      )
    }

    // Перевіряємо, чи користувач є творцем квесту
    if (quest.creatorId !== userId) {
      return NextResponse.json(
        { error: 'Недостатньо прав для відкликання квесту' },
        { status: 403 }
      )
    }

    // Перевіряємо, чи можна відкликати квест (тільки відкриті квести)
    if (quest.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Можна відкликати тільки відкриті квести' },
        { status: 400 }
      )
    }

    // Відкликаємо квест (встановлюємо статус CANCELLED)
    const updatedQuest = await prisma.quest.update({
      where: { id: questId },
      data: {
        status: 'CANCELLED' // Встановлюємо статус відкликано
      },
              include: {
          creator: {
            select: {
              id: true,
              name: true,
              heroName: true,
              heroClass: true,
              experience: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              heroName: true,
              heroClass: true,
              experience: true
            }
          }
        }
    })

    return NextResponse.json({
      message: 'Квест успішно відкликано',
      quest: updatedQuest
    })
  } catch (error) {
    console.error('Cancel quest error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 