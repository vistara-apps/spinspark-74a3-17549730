
'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { LeaderboardEntry as LeaderboardEntryType } from '../types'

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType
  isCurrentUser?: boolean
  variant?: 'userAuthenticated' | 'otherUser'
}

export function LeaderboardEntry({ entry, isCurrentUser = false, variant = 'otherUser' }: LeaderboardEntryProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-textSecondary">#{rank}</span>
    }
  }
  
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-200 bg-yellow-50'
      case 2:
        return 'border-gray-200 bg-gray-50'
      case 3:
        return 'border-amber-200 bg-amber-50'
      default:
        return 'border-gray-100 bg-surface'
    }
  }
  
  return (
    <div className={`
      leaderboard-entry
      ${isCurrentUser ? 'ring-2 ring-primary ring-offset-2' : ''}
      ${getRankColor(entry.rank)}
    `}>
      <div className="flex items-center space-x-md">
        {getRankIcon(entry.rank)}
        <div>
          <p className="font-semibold text-textPrimary">
            {isCurrentUser ? 'You' : `User ${entry.userId.slice(-6)}`}
          </p>
          {isCurrentUser && (
            <p className="text-caption text-textSecondary">Your rank</p>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-accent">{entry.sparkTokens.toLocaleString()}</p>
        <p className="text-caption text-textSecondary">Spark Tokens</p>
      </div>
    </div>
  )
}
