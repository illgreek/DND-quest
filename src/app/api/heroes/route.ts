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

    const heroes = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        heroName: true,
        heroClass: true,
        heroLevel: true,
        experience: true,
        gold: true,
        createdAt: true
      },
      orderBy: { heroLevel: 'desc' }
    })

    return NextResponse.json(heroes)
  } catch (error) {
    console.error('GET heroes error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 