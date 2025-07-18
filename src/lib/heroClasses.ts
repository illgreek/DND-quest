export const heroClasses = {
  Warrior: { label: 'Воїн', emoji: '⚔️', color: 'text-red-400' },
  Mage: { label: 'Маг', emoji: '🔮', color: 'text-blue-400' },
  Rogue: { label: 'Розбійник', emoji: '🗡️', color: 'text-purple-400' },
  Cleric: { label: 'Жрець', emoji: '⛪', color: 'text-white' },
  Ranger: { label: 'Рейнджер', emoji: '🏹', color: 'text-green-400' },
  Paladin: { label: 'Паладін', emoji: '🛡️', color: 'text-yellow-400' }
}

export const getHeroClassLabel = (heroClass: string) => {
  return heroClasses[heroClass as keyof typeof heroClasses]?.label || heroClass
}

export const getHeroClassEmoji = (heroClass: string) => {
  return heroClasses[heroClass as keyof typeof heroClasses]?.emoji || '👤'
}

export const getHeroClassColor = (heroClass: string) => {
  return heroClasses[heroClass as keyof typeof heroClasses]?.color || 'text-gray-400'
} 