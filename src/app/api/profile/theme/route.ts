import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { themeType } = await request.json()

    if (!themeType || !['STANDARD', 'CLASS'].includes(themeType)) {
      return NextResponse.json({ error: 'Invalid theme type' }, { status: 400 })
    }

    console.log('Updating theme for user:', session.user.id, 'to:', themeType)

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        themeType
      }
    })

    console.log('Theme updated for user:', updatedUser.id)

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 