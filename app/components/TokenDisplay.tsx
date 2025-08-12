'use client'

import { useEffect, useState } from 'react'
import { Coins, Sparkles } from 'lucide-react'

interface TokenDisplayProps {
  tokens: number
  variant?: 'compact' | 'detailed'
  className?: string
  animate?: boolean
}

export function TokenDisplay({ tokens, variant = 'compact', className = '', animate = false }: TokenDisplayProps) {
  const [displayTokens, setDisplayTokens] = useState(tokens)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (animate && tokens !== displayTokens) {
      setIsAnimating(true)
      const duration = 600
      const steps = 30
      const increment = (tokens - displayTokens) / steps
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        if (currentStep >= steps) {
          setDisplayTokens(tokens)
          setIsAnimating(false)
          clearInterval(timer)
        } else {
          setDisplayTokens(Math.round(displayTokens + increment * currentStep))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    } else {
      setDisplayTokens(tokens)
    }
  }, [tokens, displayTokens, animate])

  if (variant === 'compact') {
    return (
      <div className={`token-display ${isAnimating ? 'animate-count-up' : ''} ${className}`}>
        <Coins className="w-5 h-5" />
        <span>{displayTokens.toLocaleString()}</span>
      </div>
    )
  }
  
  return (
    <div className={`card text-center relative overflow-hidden ${className}`}>
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-lg"></div>
      
      {/* Sparkle Effects */}
      <div className="absolute top-2 right-2">
        <Sparkles className="w-4 h-4 text-accent/40 animate-pulse" />
      </div>
      <div className="absolute bottom-2 left-2">
        <Sparkles className="w-3 h-3 text-primary/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center space-x-sm mb-sm">
          <div className="relative">
            <Coins className="w-10 h-10 text-accent drop-shadow-sm" />
            {isAnimating && (
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-accent/20 animate-ping"></div>
            )}
          </div>
          <span className={`text-display text-gradient font-bold ${isAnimating ? 'animate-count-up' : ''}`}>
            {displayTokens.toLocaleString()}
          </span>
        </div>
        <p className="text-caption text-textSecondary font-medium">Spark Tokens</p>
        
        {/* Progress Bar Decoration */}
        <div className="mt-md">
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((tokens / 1000) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            {tokens < 1000 ? `${1000 - tokens} to next milestone` : 'Milestone reached! 🎉'}
          </p>
        </div>
      </div>
    </div>
  )
}
