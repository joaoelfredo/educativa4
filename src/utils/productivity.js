import AsyncStorage from '@react-native-async-storage/async-storage'

const XP_KEY = '@xp'
const HISTORY_KEY = '@history'

const parseJSON = (value, fallback) => {
  try {
    return value != null ? JSON.parse(value) : fallback
  } catch (error) {
    console.error('[productivity] parseJSON error:', error)
    return fallback
  }
}

export const saveXP = async (xp) => {
  try {
    await AsyncStorage.setItem(XP_KEY, xp.toString())
  } catch (error) {
    console.error('[productivity] saveXP error:', error)
  }
}

export const loadXP = async () => {
  try {
    const value = await AsyncStorage.getItem(XP_KEY)
    if (value === null) return 0
    const parsed = Number(value)
    return Number.isNaN(parsed) ? 0 : parsed
  } catch (error) {
    console.error('[productivity] loadXP error:', error)
    return 0
  }
}

export const saveHistory = async (history) => {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('[productivity] saveHistory error:', error)
  }
}

export const loadHistory = async () => {
  try {
    const value = await AsyncStorage.getItem(HISTORY_KEY)
    return parseJSON(value, [])
  } catch (error) {
    console.error('[productivity] loadHistory error:', error)
    return []
  }
}

const toDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const getMonday = (date) => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = (day + 6) % 7
  result.setDate(result.getDate() - diff)
  result.setHours(0, 0, 0, 0)
  return result
}

export const getWeeklyCompleted = (history) => {
  const now = new Date()
  const weekStart = getMonday(now)
  return history.reduce((count, item) => {
    if (!item.completed || !item.completedAt) return count
    const completedAt = toDate(item.completedAt)
    if (!completedAt) return count
    return completedAt >= weekStart && completedAt <= now ? count + 1 : count
  }, 0)
}

export const getMonthlyCompleted = (history) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  return history.reduce((count, item) => {
    if (!item.completed || !item.completedAt) return count
    const completedAt = toDate(item.completedAt)
    if (!completedAt) return count
    return completedAt.getFullYear() === currentYear && completedAt.getMonth() === currentMonth
      ? count + 1
      : count
  }, 0)
}

export const getYearlyCompleted = (history) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  return history.reduce((count, item) => {
    if (!item.completed || !item.completedAt) return count
    const completedAt = toDate(item.completedAt)
    if (!completedAt) return count
    return completedAt.getFullYear() === currentYear ? count + 1 : count
  }, 0)
}
