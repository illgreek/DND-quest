import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get updated user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return NextResponse.json(
        { error: 'Користувача не знайдено' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Update session error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 