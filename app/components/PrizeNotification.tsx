'use client'

import { useEffect, useState } from 'react'
import { SpinPrize } from '../types'
import { Sparkles, Star, Gift } from 'lucide-react'

interface PrizeNotificationProps {
  prize: SpinPrize | null
  onClose: () => void
}

export function PrizeNotification({ prize, onClose }: PrizeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  useEffect(() => {
    if (prize) {
      setIsVisible(true)
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [prize, onClose])
  
  if (!prize) return null

  const isHighValue = prize.tokens >= 100
  
  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce-in"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {Math.random() > 0.5 ? (
                <Sparkles 
                  className={`w-4 h-4 ${Math.random() > 0.5 ? 'text-accent' : 'text-primary'} animate-pulse`}
                  style={{ animationDelay: `${Math.random()}s` }}
                />
              ) : (
                <Star 
                  className={`w-3 h-3 ${Math.random() > 0.5 ? 'text-accent' : 'text-primary'} animate-pulse`}
                  style={{ animationDelay: `${Math.random()}s` }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className={`
        bg-surface rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl transform transition-all duration-300 relative overflow-hidden
        ${isVisible ? 'scale-100 animate-bounce-in' : 'scale-90'}
      `}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 rounded-2xl"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4">
          <Star className="w-5 h-5 text-accent animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Gift className="w-4 h-4 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-center mb-lg">
            <div className="relative">
              <div 
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg ${
                  isHighValue ? 'animate-pulse' : ''
                }`}
                style={{ 
                  background: `linear-gradient(135deg, ${prize.color || '#f59e0b'}, ${prize.color || '#f59e0b'}dd)`,
                  boxShadow: `0 8px 32px ${prize.color || '#f59e0b'}40`
                }}
              >
                {isHighValue ? '🏆' : '🎉'}
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-accent/20 animate-ping"></div>
            </div>
          </div>
          
          <h2 className="text-heading text-gradient mb-md">
            {isHighValue ? 'AMAZING WIN!' : 'Congratulations!'}
          </h2>
          <p className="text-body mb-lg font-medium">You won an incredible prize!</p>
          
          <div className={`bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-lg mb-lg border-2 ${
            isHighValue ? 'border-accent animate-pulse' : 'border-accent/30'
          }`}>
            <p className="text-display text-gradient font-bold mb-sm">{prize.name}</p>
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <p className="text-accent font-bold text-xl">+{prize.tokens} Spark Tokens</p>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
          </div>

          {isHighValue && (
            <div className="mb-lg">
              <p className="text-sm text-gradient font-semibold animate-pulse">
                🌟 Exceptional Win! 🌟
              </p>
            </div>
          )}
          
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="btn-primary w-full text-lg py-4 hover:scale-105 active:scale-95 transition-transform"
          >
            Awesome! 🎉
          </button>
        </div>
      </div>
    </div>
  )
}
