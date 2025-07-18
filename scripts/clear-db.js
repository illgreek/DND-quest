const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearDatabase() {
  try {
    console.log('🗑️  Починаю очищення бази даних...')

    // Видаляємо дані в правильному порядку (з урахуванням foreign keys)
    console.log('📝 Видаляю квести...')
    await prisma.quest.deleteMany({})
    
    console.log('🤝 Видаляю дружби...')
    await prisma.friendship.deleteMany({})
    
    console.log('👤 Видаляю користувачів...')
    await prisma.user.deleteMany({})
    
    console.log('🔐 Видаляю сесії...')
    await prisma.session.deleteMany({})
    
    console.log('💳 Видаляю акаунти...')
    await prisma.account.deleteMany({})
    
    console.log('✅ База даних успішно очищена!')
    
    // Показуємо статистику
    const userCount = await prisma.user.count()
    const questCount = await prisma.quest.count()
    const friendshipCount = await prisma.friendship.count()
    
    console.log('\n📊 Статистика після очищення:')
    console.log(`👤 Користувачів: ${userCount}`)
    console.log(`📝 Квестів: ${questCount}`)
    console.log(`🤝 Дружб: ${friendshipCount}`)
    
  } catch (error) {
    console.error('❌ Помилка при очищенні бази даних:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаємо скрипт
clearDatabase() 