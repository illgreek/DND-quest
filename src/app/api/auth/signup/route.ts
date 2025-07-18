import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, heroName, heroClass } = await request.json()

    // Validation
    if (!name || !email || !password || !heroName) {
      return NextResponse.json(
        { error: 'Всі поля обов\'язкові' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Користувач з таким email вже існує' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        heroName,
        heroClass: heroClass || 'Warrior',
        heroLevel: 1,
        experience: 0,
        gold: 0
      }
    })

    return NextResponse.json(
      { message: 'Користувача створено успішно' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 