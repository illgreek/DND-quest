// Кольорові палітри для кожного класу
export const classColorPalettes = {
  Warrior: {
    primary: '#dc2626',      // red-600
    secondary: '#991b1b',    // red-800
    accent: '#fca5a5',       // red-300
    highlight: '#fef2f2',    // red-50
    text: '#dc2626',         // red-600
    bg: '#1f1f1f',          // dark bg
    border: '#dc2626'        // red-600
  },
  Mage: {
    primary: '#2563eb',      // blue-600
    secondary: '#1d4ed8',    // blue-700
    accent: '#93c5fd',       // blue-300
    highlight: '#eff6ff',    // blue-50
    text: '#2563eb',         // blue-600
    bg: '#1f1f1f',          // dark bg
    border: '#2563eb'        // blue-600
  },
  Rogue: {
    primary: '#9333ea',      // purple-600
    secondary: '#7c3aed',    // purple-700
    accent: '#c4b5fd',       // purple-300
    highlight: '#faf5ff',    // purple-50
    text: '#9333ea',         // purple-600
    bg: '#1f1f1f',          // dark bg
    border: '#9333ea'        // purple-600
  },
  Cleric: {
    primary: '#fbbf24',      // amber-400
    secondary: '#f59e0b',    // amber-500
    accent: '#fde68a',       // amber-200
    highlight: '#fffbeb',    // amber-50
    text: '#fbbf24',         // amber-400
    bg: '#1f1f1f',          // dark bg
    border: '#fbbf24'        // amber-400
  },
  Ranger: {
    primary: '#16a34a',      // green-600
    secondary: '#15803d',    // green-700
    accent: '#86efac',       // green-300
    highlight: '#f0fdf4',    // green-50
    text: '#16a34a',         // green-600
    bg: '#1f1f1f',          // dark bg
    border: '#16a34a'        // green-600
  },
  Paladin: {
    primary: '#eab308',      // yellow-500
    secondary: '#ca8a04',    // yellow-600
    accent: '#fde047',       // yellow-300
    highlight: '#fefce8',    // yellow-50
    text: '#eab308',         // yellow-500
    bg: '#1f1f1f',          // dark bg
    border: '#eab308'        // yellow-500
  }
}

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

export const getClassColorPalette = (heroClass: string) => {
  return classColorPalettes[heroClass as keyof typeof classColorPalettes] || classColorPalettes.Warrior
}

export const getClassCSSVariables = (heroClass: string): Record<string, string> => {
  const palette = getClassColorPalette(heroClass)
  return {
    '--class-primary': palette.primary,
    '--class-secondary': palette.secondary,
    '--class-accent': palette.accent,
    '--class-highlight': palette.highlight,
    '--class-text': palette.text,
    '--class-bg': palette.bg,
    '--class-border': palette.border,
    '--class-surface': '#252838',
    '--class-background': '#1a1d29'
  }
} 