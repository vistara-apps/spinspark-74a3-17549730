
'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface CooldownTimerProps {
  endTime: number
  onComplete: () => void
}

export function CooldownTimer({ endTime, onComplete }: CooldownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, endTime - now)
      
      setTimeLeft(remaining)
      
      if (remaining === 0) {
        onComplete()
      }
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [endTime, onComplete])
  
  if (timeLeft === 0) {
    return null
  }
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  
  return (
    <div className="card text-center">
      <div className="flex items-center justify-center space-x-sm mb-sm">
        <Clock className="w-5 h-5 text-textSecondary" />
        <span className="text-heading font-mono">
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <p className="text-caption text-textSecondary">Next spin available</p>
    </div>
  )
}
