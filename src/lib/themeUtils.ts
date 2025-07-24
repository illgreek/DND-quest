import { getClassCSSVariables } from './heroClasses'

// Глобальний стан теми
let currentTheme: string | null = null
let currentHeroClass: string | null = null

export const applyTheme = (themeType: string | null | undefined, heroClass?: string | null | undefined) => {
  console.log('Applying theme:', { themeType, heroClass })
  
  // Перевіряємо, чи не встановлена вже така ж тема
  if (currentTheme === themeType && currentHeroClass === heroClass) {
    console.log('Theme already applied, skipping...')
    return
  }
  
  const root = document.documentElement
  
  if (themeType === 'CLASS' && heroClass) {
    console.log('Applying CLASS theme for:', heroClass)
    const cssVars = getClassCSSVariables(heroClass)
    console.log('CSS variables:', cssVars)
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
      console.log(`Set ${key} = ${value}`)
    })
  } else {
    console.log('Applying STANDARD theme')
    // Стандартна тема - скидаємо до дефолтних значень
    const defaultVars = {
      '--class-primary': '#624cab',
      '--class-secondary': '#a48fff',
      '--class-accent': '#a48fff',
      '--class-highlight': '#fef2f2',
      '--class-text': '#d4c6ff',
      '--class-bg': '#1f1f1f',
      '--class-border': '#624cab',
      '--class-surface': '#252838',
      '--class-background': '#1a1d29'
    }
    Object.entries(defaultVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
      console.log(`Set ${key} = ${value}`)
    })
  }
  
  // Оновлюємо глобальний стан
  currentTheme = themeType || null
  currentHeroClass = heroClass || null
  
  // Примусово оновлюємо всі компоненти
  document.documentElement.style.setProperty('--theme-updated', Date.now().toString())
}

export const getThemeColors = (themeType: string, heroClass?: string) => {
  if (themeType === 'CLASS' && heroClass) {
    return getClassCSSVariables(heroClass)
  }
  
  return {
    '--class-primary': '#624cab',
    '--class-secondary': '#a48fff',
    '--class-accent': '#3d2b6b',
    '--class-highlight': '#fef2f2',
    '--class-text': '#d4c6ff',
    '--class-bg': '#1f1f1f',
    '--class-border': '#624cab'
  }
} 