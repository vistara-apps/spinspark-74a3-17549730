
import { User, SpinHistory, LeaderboardEntry } from '../types'

const STORAGE_KEYS = {
  USER: 'spinspark_user',
  SPIN_HISTORY: 'spinspark_history',
  LEADERBOARD: 'spinspark_leaderboard',
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(STORAGE_KEYS.USER)
  return stored ? JSON.parse(stored) : null
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function createUser(userId: string): User {
  const user: User = {
    userId,
    sparkTokens: 0,
    spinCooldownEnd: 0,
    createdAt: Date.now(),
  }
  
  saveUser(user)
  return user
}

export function addSpinHistory(spin: SpinHistory): void {
  if (typeof window === 'undefined') return
  
  const stored = localStorage.getItem(STORAGE_KEYS.SPIN_HISTORY)
  const history: SpinHistory[] = stored ? JSON.parse(stored) : []
  
  history.unshift(spin)
  // Keep only last 50 spins
  if (history.length > 50) {
    history.splice(50)
  }
  
  localStorage.setItem(STORAGE_KEYS.SPIN_HISTORY, JSON.stringify(history))
}

export function getSpinHistory(): SpinHistory[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEYS.SPIN_HISTORY)
  return stored ? JSON.parse(stored) : []
}

export function updateLeaderboard(userId: string, newTokens: number): void {
  if (typeof window === 'undefined') return
  
  const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD)
  const leaderboard: LeaderboardEntry[] = stored ? JSON.parse(stored) : []
  
  const existingIndex = leaderboard.findIndex(entry => entry.userId === userId)
  
  if (existingIndex >= 0) {
    leaderboard[existingIndex].sparkTokens = newTokens
  } else {
    leaderboard.push({
      userId,
      sparkTokens: newTokens,
      rank: 0,
    })
  }
  
  // Sort by tokens descending and update ranks
  leaderboard.sort((a, b) => b.sparkTokens - a.sparkTokens)
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1
  })
  
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard))
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD)
  const leaderboard: LeaderboardEntry[] = stored ? JSON.parse(stored) : []
  
  // Add some demo data if empty
  if (leaderboard.length === 0) {
    const demoData: LeaderboardEntry[] = [
      { userId: 'demo1', sparkTokens: 1250, rank: 1 },
      { userId: 'demo2', sparkTokens: 980, rank: 2 },
      { userId: 'demo3', sparkTokens: 750, rank: 3 },
      { userId: 'demo4', sparkTokens: 620, rank: 4 },
      { userId: 'demo5', sparkTokens: 450, rank: 5 },
    ]
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(demoData))
    return demoData
  }
  
  return leaderboard
}
