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
    const friendshipId = resolvedParams.id

    // Check if friendship exists and user is the receiver
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    })

    if (!friendship) {
      return NextResponse.json(
        { error: 'Запит дружби не знайдено' },
        { status: 404 }
      )
    }

    if (friendship.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Тільки отримувач може відхилити запит дружби' },
        { status: 403 }
      )
    }

    if (friendship.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Запит дружби вже оброблено' },
        { status: 400 }
      )
    }

    // Reject friendship
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: {
        status: 'REJECTED'
      }
    })

    return NextResponse.json(updatedFriendship)
  } catch (error) {
    console.error('Reject friendship error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 