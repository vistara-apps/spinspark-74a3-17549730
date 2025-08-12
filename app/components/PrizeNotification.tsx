
'use client'

import { useEffect, useState } from 'react'
import { SpinPrize } from '../types'
import { Sparkles } from 'lucide-react'

interface PrizeNotificationProps {
  prize: SpinPrize | null
  onClose: () => void
}

export function PrizeNotification({ prize, onClose }: PrizeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (prize) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [prize, onClose])
  
  if (!prize) return null
  
  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        bg-surface rounded-lg p-8 text-center max-w-sm mx-4 shadow-2xl transform transition-all duration-300
        ${isVisible ? 'scale-100 animate-bounce-in' : 'scale-90'}
      `}>
        <div className="flex justify-center mb-lg">
          <div className="relative">
            <Sparkles className="w-16 h-16 text-accent animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-accent/20 animate-ping"></div>
          </div>
        </div>
        
        <h2 className="text-heading text-gradient mb-md">Congratulations!</h2>
        <p className="text-body mb-lg">You won:</p>
        
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-lg mb-lg">
          <p className="text-display text-gradient font-bold">{prize.name}</p>
          <p className="text-caption text-textSecondary">+{prize.tokens} Spark Tokens</p>
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="btn-primary w-full"
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}
