
'use client'

import { Coins } from 'lucide-react'

interface TokenDisplayProps {
  tokens: number
  variant?: 'compact' | 'detailed'
  className?: string
}

export function TokenDisplay({ tokens, variant = 'compact', className = '' }: TokenDisplayProps) {
  if (variant === 'compact') {
    return (
      <div className={`token-display ${className}`}>
        <Coins className="w-5 h-5" />
        <span>{tokens.toLocaleString()}</span>
      </div>
    )
  }
  
  return (
    <div className={`card text-center ${className}`}>
      <div className="flex items-center justify-center space-x-sm mb-sm">
        <Coins className="w-8 h-8 text-accent" />
        <span className="text-display text-gradient">{tokens.toLocaleString()}</span>
      </div>
      <p className="text-caption text-textSecondary">Spark Tokens</p>
    </div>
  )
}
