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
        return 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-lg'
      case 2:
        return 'border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 shadow-md'
      case 3:
        return 'border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 shadow-md'
      default:
        return 'border-gray-100 bg-surface hover:bg-gray-50'
    }
  }
  
  return (
    <div className={`
      leaderboard-entry transition-all duration-200 transform hover:scale-[1.02]
      ${isCurrentUser ? 'ring-2 ring-primary ring-offset-2 animate-pulse' : ''}
      ${getRankColor(entry.rank)}
    `}>
      <div className="flex items-center space-x-md">
        <div className="relative">
          {getRankIcon(entry.rank)}
          {entry.rank <= 3 && (
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 animate-pulse"></div>
          )}
        </div>
        <div>
          <p className="font-semibold text-textPrimary flex items-center space-x-1">
            <span>{isCurrentUser ? 'You' : `User ${entry.userId.slice(-6)}`}</span>
            {isCurrentUser && <span className="text-primary">👑</span>}
          </p>
          {isCurrentUser && (
            <p className="text-caption text-primary font-medium">Your rank</p>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <div className="flex items-center justify-end space-x-1">
          <p className="font-bold text-accent text-lg">{entry.sparkTokens.toLocaleString()}</p>
          {entry.rank <= 3 && <span className="text-accent">✨</span>}
        </div>
        <p className="text-caption text-textSecondary">Spark Tokens</p>
        
        {/* Progress bar for visual comparison */}
        <div className="w-16 h-1 bg-gray-200 rounded-full mt-1 ml-auto overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((entry.sparkTokens / Math.max(...[entry.sparkTokens])) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
