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
    const type = searchParams.get('type') // 'all', 'assigned_to_me', 'created_by_me'
    const userId = session.user.id

    let quests

    switch (type) {
      case 'assigned_to_me':
        // Квести, призначені мені (включаючи відкриті та в процесі), але не створені мною
        quests = await prisma.quest.findMany({
          where: { 
            receiverId: userId,
            creatorId: { not: userId }, // Виключаємо квести, створені самим користувачем
            status: { in: ['OPEN', 'IN_PROGRESS', 'COMPLETED'] } // Виключаємо відкликані квести
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
          },
          orderBy: { createdAt: 'desc' }
        })
        break
      
      case 'created_by_me':
        // Квести, створені мною (включаючи відкликані)
        quests = await prisma.quest.findMany({
          where: { creatorId: userId },
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
          },
          orderBy: { createdAt: 'desc' }
        })
        break
      
      case 'all':
      default:
        // Всі квести, пов'язані з користувачем (створені або призначені), включаючи відкликані
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

    console.log('Creating quest with data:', {
      title,
      description,
      reward,
      experience,
      difficulty,
      category,
      assignTo,
      assignToType: typeof assignTo,
      assignToLength: assignTo ? assignTo.length : 0
    })

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Назва та опис квесту обов\'язкові' },
        { status: 400 }
      )
    }

    // Handle assignment
    let receiverId = null
    let initialStatus = 'OPEN' // За замовчуванням квест відкритий
    
    console.log('Assignment logic:', {
      assignTo,
      assignToTrimmed: assignTo ? assignTo.trim() : null,
      isEmpty: assignTo ? assignTo.trim() === '' : true,
      sessionUserId: session.user.id
    })
    
    // Якщо assignTo не передано або порожній, за замовчуванням призначаємо собі
    if (!assignTo || assignTo.trim() === '') {
      receiverId = session.user.id
      initialStatus = 'IN_PROGRESS'
      console.log('Default assignment to self:', { receiverId, initialStatus })
    } else if (assignTo === 'self') {
      receiverId = session.user.id // Призначаємо квест самому собі
      initialStatus = 'IN_PROGRESS' // Якщо квест для себе, одразу стає в процесі виконання
      console.log('Assigning to self:', { receiverId, initialStatus })
    } else {
      receiverId = assignTo // Призначаємо квест другу
      console.log('Assigning to friend:', { receiverId, initialStatus })
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
        receiverId: receiverId,
        status: initialStatus
      }
    })

    console.log('Created quest:', {
      id: quest.id,
      title: quest.title,
      reward: quest.reward,
      experience: quest.experience,
      difficulty: quest.difficulty,
      receiverId: quest.receiverId,
      status: quest.status,
      creatorId: quest.creatorId
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