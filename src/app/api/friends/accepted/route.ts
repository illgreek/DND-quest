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

    // Get accepted friendships
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ],
        status: 'ACCEPTED'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            heroName: true,
            heroClass: true,
            heroLevel: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            heroName: true,
            heroClass: true,
            heroLevel: true
          }
        }
      }
    })

    // Extract friends (excluding the current user)
    const friends = friendships.map((friendship: any) => {
      if (friendship.senderId === userId) {
        return friendship.receiver
      } else {
        return friendship.sender
      }
    })

    return NextResponse.json(friends)
  } catch (error) {
    console.error('GET accepted friends error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 