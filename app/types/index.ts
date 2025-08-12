
export interface User {
  userId: string
  sparkTokens: number
  spinCooldownEnd: number
  leaderboardRank?: number
  createdAt: number
}

export interface SpinHistory {
  spinId: string
  userId: string
  timestamp: number
  prizeWon: string
  tokensEarned: number
}

export interface SpinPrize {
  id: string
  tokens: number
  name: string
  color: string
  probability: number
}

export interface LeaderboardEntry {
  userId: string
  sparkTokens: number
  rank: number
  address?: string
}
