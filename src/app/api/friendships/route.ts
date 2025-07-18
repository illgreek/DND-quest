import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - отримати дружби користувача
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(friendships)
  } catch (error) {
    console.error('GET friendships error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
}

// POST - відправити запит дружби
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const { receiverId } = await request.json()

    if (!receiverId) {
      return NextResponse.json(
        { error: 'ID отримувача обов\'язковий' },
        { status: 400 }
      )
    }

    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: 'Не можна додати себе в друзі' },
        { status: 400 }
      )
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            senderId: session.user.id,
            receiverId: receiverId
          },
          {
            senderId: receiverId,
            receiverId: session.user.id
          }
        ]
      }
    })

    if (existingFriendship) {
      return NextResponse.json(
        { error: 'Запит дружби вже існує' },
        { status: 400 }
      )
    }

    // Create friendship request
    const friendship = await prisma.friendship.create({
      data: {
        senderId: session.user.id,
        receiverId: receiverId,
        status: 'PENDING'
      }
    })

    return NextResponse.json(friendship, { status: 201 })
  } catch (error) {
    console.error('POST friendship error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 