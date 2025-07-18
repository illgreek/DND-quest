export interface HeroLevel {
  level: number
  title: string
  experienceRequired: number
  description: string
}

export interface HeroClassLevels {
  [key: string]: HeroLevel[]
}

// Система рівнів та титулів для кожного класу
export const heroLevels: HeroClassLevels = {
  Warrior: [
    { level: 1, title: 'Новачок Воїн', experienceRequired: 0, description: 'Початківець у мистецтві війни' },
    { level: 2, title: 'Воїн-Учень', experienceRequired: 100, description: 'Вивчає основи бою' },
    { level: 3, title: 'Воїн-Захисник', experienceRequired: 250, description: 'Захищає слабких' },
    { level: 4, title: 'Воїн-Ветеран', experienceRequired: 500, description: 'Досвідчений боєць' },
    { level: 5, title: 'Воїн-Герой', experienceRequired: 1000, description: 'Справжній герой битви' },
    { level: 6, title: 'Воїн-Легенда', experienceRequired: 2000, description: 'Легендарний воїн' },
    { level: 7, title: 'Воїн-Повелитель', experienceRequired: 4000, description: 'Повелитель поля бою' },
    { level: 8, title: 'Воїн-Бог', experienceRequired: 8000, description: 'Божественний воїн' },
    { level: 9, title: 'Воїн-Імперіум', experienceRequired: 16000, description: 'Імперський воїн' },
    { level: 10, title: 'Воїн-Абсолют', experienceRequired: 32000, description: 'Абсолютний воїн' }
  ],
  
  Mage: [
    { level: 1, title: 'Новачок Маг', experienceRequired: 0, description: 'Початківець у магії' },
    { level: 2, title: 'Маг-Учень', experienceRequired: 100, description: 'Вивчає закляття' },
    { level: 3, title: 'Маг-Чаклун', experienceRequired: 250, description: 'Володіє таємними знаннями' },
    { level: 4, title: 'Маг-Мудрець', experienceRequired: 500, description: 'Мудрий чаклун' },
    { level: 5, title: 'Маг-Архімаг', experienceRequired: 1000, description: 'Архімаг' },
    { level: 6, title: 'Маг-Легенда', experienceRequired: 2000, description: 'Легендарний маг' },
    { level: 7, title: 'Маг-Повелитель', experienceRequired: 4000, description: 'Повелитель магії' },
    { level: 8, title: 'Маг-Бог', experienceRequired: 8000, description: 'Божественний маг' },
    { level: 9, title: 'Маг-Імперіум', experienceRequired: 16000, description: 'Імперський маг' },
    { level: 10, title: 'Маг-Абсолют', experienceRequired: 32000, description: 'Абсолютний маг' }
  ],
  
  Rogue: [
    { level: 1, title: 'Новачок Розбійник', experienceRequired: 0, description: 'Початківець у тінях' },
    { level: 2, title: 'Розбійник-Учень', experienceRequired: 100, description: 'Вивчає мистецтво тіней' },
    { level: 3, title: 'Розбійник-Тінь', experienceRequired: 250, description: 'Невідомий у тінях' },
    { level: 4, title: 'Розбійник-Ветеран', experienceRequired: 500, description: 'Досвідчений розбійник' },
    { level: 5, title: 'Розбійник-Герой', experienceRequired: 1000, description: 'Герой тіней' },
    { level: 6, title: 'Розбійник-Легенда', experienceRequired: 2000, description: 'Легендарний розбійник' },
    { level: 7, title: 'Розбійник-Повелитель', experienceRequired: 4000, description: 'Повелитель тіней' },
    { level: 8, title: 'Розбійник-Бог', experienceRequired: 8000, description: 'Божественний розбійник' },
    { level: 9, title: 'Розбійник-Імперіум', experienceRequired: 16000, description: 'Імперський розбійник' },
    { level: 10, title: 'Розбійник-Абсолют', experienceRequired: 32000, description: 'Абсолютний розбійник' }
  ],
  
  Cleric: [
    { level: 1, title: 'Новачок Жрець', experienceRequired: 0, description: 'Початківець у вірі' },
    { level: 2, title: 'Жрець-Учень', experienceRequired: 100, description: 'Вивчає священні тексти' },
    { level: 3, title: 'Жрець-Священник', experienceRequired: 250, description: 'Священник' },
    { level: 4, title: 'Жрець-Ветеран', experienceRequired: 500, description: 'Досвідчений жрець' },
    { level: 5, title: 'Жрець-Герой', experienceRequired: 1000, description: 'Герой віри' },
    { level: 6, title: 'Жрець-Легенда', experienceRequired: 2000, description: 'Легендарний жрець' },
    { level: 7, title: 'Жрець-Повелитель', experienceRequired: 4000, description: 'Повелитель віри' },
    { level: 8, title: 'Жрець-Бог', experienceRequired: 8000, description: 'Божественний жрець' },
    { level: 9, title: 'Жрець-Імперіум', experienceRequired: 16000, description: 'Імперський жрець' },
    { level: 10, title: 'Жрець-Абсолют', experienceRequired: 32000, description: 'Абсолютний жрець' }
  ],
  
  Ranger: [
    { level: 1, title: 'Новачок Рейнджер', experienceRequired: 0, description: 'Початківець у природі' },
    { level: 2, title: 'Рейнджер-Учень', experienceRequired: 100, description: 'Вивчає природу' },
    { level: 3, title: 'Рейнджер-Мисливець', experienceRequired: 250, description: 'Досвідчений мисливець' },
    { level: 4, title: 'Рейнджер-Ветеран', experienceRequired: 500, description: 'Ветеран природи' },
    { level: 5, title: 'Рейнджер-Герой', experienceRequired: 1000, description: 'Герой природи' },
    { level: 6, title: 'Рейнджер-Легенда', experienceRequired: 2000, description: 'Легендарний рейнджер' },
    { level: 7, title: 'Рейнджер-Повелитель', experienceRequired: 4000, description: 'Повелитель природи' },
    { level: 8, title: 'Рейнджер-Бог', experienceRequired: 8000, description: 'Божественний рейнджер' },
    { level: 9, title: 'Рейнджер-Імперіум', experienceRequired: 16000, description: 'Імперський рейнджер' },
    { level: 10, title: 'Рейнджер-Абсолют', experienceRequired: 32000, description: 'Абсолютний рейнджер' }
  ],
  
  Paladin: [
    { level: 1, title: 'Новачок Паладин', experienceRequired: 0, description: 'Початківець у святості' },
    { level: 2, title: 'Паладин-Учень', experienceRequired: 100, description: 'Вивчає священні клятви' },
    { level: 3, title: 'Паладин-Захисник', experienceRequired: 250, description: 'Захисник святого' },
    { level: 4, title: 'Паладин-Ветеран', experienceRequired: 500, description: 'Ветеран святості' },
    { level: 5, title: 'Паладин-Герой', experienceRequired: 1000, description: 'Герой святості' },
    { level: 6, title: 'Паладин-Легенда', experienceRequired: 2000, description: 'Легендарний паладин' },
    { level: 7, title: 'Паладин-Повелитель', experienceRequired: 4000, description: 'Повелитель святості' },
    { level: 8, title: 'Паладин-Бог', experienceRequired: 8000, description: 'Божественний паладин' },
    { level: 9, title: 'Паладин-Імперіум', experienceRequired: 16000, description: 'Імперський паладин' },
    { level: 10, title: 'Паладин-Абсолют', experienceRequired: 32000, description: 'Абсолютний паладин' }
  ]
}

// Функція для отримання поточного рівня героя
export function getCurrentLevel(heroClass: string, experience: number): HeroLevel {
  const levels = heroLevels[heroClass] || heroLevels.Warrior
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (experience >= levels[i].experienceRequired) {
      return levels[i]
    }
  }
  
  return levels[0]
}

// Функція для отримання наступного рівня
export function getNextLevel(heroClass: string, experience: number): HeroLevel | null {
  const levels = heroLevels[heroClass] || heroLevels.Warrior
  const currentLevel = getCurrentLevel(heroClass, experience)
  
  const nextLevelIndex = levels.findIndex(level => level.level === currentLevel.level + 1)
  
  if (nextLevelIndex !== -1) {
    return levels[nextLevelIndex]
  }
  
  return null
}

// Функція для перевірки, чи герой може підвищитися
export function canLevelUp(heroClass: string, experience: number): boolean {
  const nextLevel = getNextLevel(heroClass, experience)
  return nextLevel !== null && experience >= nextLevel.experienceRequired
}

// Функція для отримання прогресу до наступного рівня
export function getLevelProgress(heroClass: string, experience: number): number {
  const currentLevel = getCurrentLevel(heroClass, experience)
  const nextLevel = getNextLevel(heroClass, experience)
  
  if (!nextLevel) {
    return 100 // Максимальний рівень
  }
  
  const currentExp = experience - currentLevel.experienceRequired
  const requiredExp = nextLevel.experienceRequired - currentLevel.experienceRequired
  
  return Math.min(100, Math.max(0, (currentExp / requiredExp) * 100))
} 