import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - отримати квести
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'created', 'accepted', 'available', 'assigned'
    const userId = session.user.id

    let quests

    switch (type) {
      case 'created':
        quests = await prisma.quest.findMany({
          where: { creatorId: userId },
          include: {
            receiver: {
              select: {
                id: true,
                name: true,
                heroName: true,
                heroClass: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
        break
      
      case 'accepted':
        quests = await prisma.quest.findMany({
          where: { 
            receiverId: userId,
            status: { in: ['IN_PROGRESS', 'COMPLETED'] }
          },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                heroName: true,
                heroClass: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
        break
      
      case 'available':
        quests = await prisma.quest.findMany({
          where: { 
            status: 'OPEN',
            creatorId: { not: userId },
            receiverId: null // Only show quests not assigned to specific users
          },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                heroName: true,
                heroClass: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
        break
      
      case 'assigned':
        quests = await prisma.quest.findMany({
          where: { 
            receiverId: userId,
            status: 'OPEN'
          },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                heroName: true,
                heroClass: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
        break
      
      default:
        quests = await prisma.quest.findMany({
          where: { 
            OR: [
              { creatorId: userId },
              { receiverId: userId }
            ]
          },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                heroName: true,
                heroClass: true
              }
            },
            receiver: {
              select: {
                id: true,
                name: true,
                heroName: true,
                heroClass: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
    }

    return NextResponse.json(quests)
  } catch (error) {
    console.error('GET quests error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
}

// POST - створити квест
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const {
      title,
      description,
      reward,
      experience,
      difficulty,
      category,
      location,
      dueDate,
      isUrgent,
      assignTo
    } = await request.json()

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Назва та опис квесту обов\'язкові' },
        { status: 400 }
      )
    }

    // Handle self-assignment
    let receiverId = null
    if (assignTo === 'self') {
      receiverId = session.user.id
    } else if (assignTo) {
      receiverId = assignTo
    }

    // Create quest
    const quest = await prisma.quest.create({
      data: {
        title,
        description,
        reward: reward || 0,
        experience: experience || 0,
        difficulty: difficulty || 'EASY',
        category: category || 'GENERAL',
        location,
        dueDate: dueDate ? new Date(dueDate) : null,
        isUrgent: isUrgent || false,
        creatorId: session.user.id,
        receiverId: receiverId
      }
    })

    return NextResponse.json(quest, { status: 201 })
  } catch (error) {
    console.error('POST quest error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 