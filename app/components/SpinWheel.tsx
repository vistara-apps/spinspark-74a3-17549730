'use client'

import { useState } from 'react'
import { SpinPrize } from '../types'
import { SPIN_PRIZES } from '../data/spinPrizes'

interface SpinWheelProps {
  isSpinning: boolean
  onSpinComplete: (prize: SpinPrize) => void
  canSpin: boolean
}

export function SpinWheel({ isSpinning, onSpinComplete, canSpin }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0)
  
  const handleSpin = () => {
    if (!canSpin || isSpinning) return
    
    // Calculate random rotation
    const baseRotation = 1440 // 4 full rotations
    const randomRotation = Math.random() * 360
    const totalRotation = baseRotation + randomRotation
    
    setRotation(prev => prev + totalRotation)
    
    // Determine which prize was won based on final rotation
    setTimeout(() => {
      const normalizedRotation = (rotation + totalRotation) % 360
      const segmentSize = 360 / SPIN_PRIZES.length
      const prizeIndex = Math.floor((360 - normalizedRotation) / segmentSize) % SPIN_PRIZES.length
      const wonPrize = SPIN_PRIZES[prizeIndex]
      
      onSpinComplete(wonPrize)
    }, 3000)
  }
  
  return (
    <div className="flex flex-col items-center space-y-lg">
      <div className="relative">
        {/* Wheel Container with Enhanced Design */}
        <div className="relative w-72 h-72">
          {/* Enhanced Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
            <div className="relative">
              <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-primary"></div>
            </div>
          </div>
          
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 p-2 shadow-2xl">
            {/* Inner Ring */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-50 p-1 shadow-inner">
              {/* Wheel */}
              <div 
                className={`relative w-full h-full rounded-full overflow-hidden shadow-lg ${
                  isSpinning ? 'animate-spin-wheel' : ''
                }`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                {SPIN_PRIZES.map((prize, index) => {
                  const angle = (360 / SPIN_PRIZES.length) * index
                  const nextAngle = (360 / SPIN_PRIZES.length) * (index + 1)
                  
                  return (
                    <div
                      key={prize.id}
                      className="absolute w-full h-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(from ${angle}deg, ${prize.color} 0deg, ${prize.color} ${360 / SPIN_PRIZES.length}deg, transparent ${360 / SPIN_PRIZES.length}deg)`,
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`,
                      }}
                    >
                      <div 
                        className="absolute text-center"
                        style={{
                          transform: `rotate(${angle + (360 / SPIN_PRIZES.length) / 2}deg) translateY(-90px)`,
                          transformOrigin: '50% 90px',
                        }}
                      >
                        <div 
                          className="text-white font-bold text-sm drop-shadow-md px-2 py-1 rounded bg-black/20 backdrop-blur-sm"
                          style={{ transform: 'rotate(0deg)' }}
                        >
                          {prize.name}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg border-4 border-white z-10 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full shadow-inner"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Spin Button */}
      <button
        onClick={handleSpin}
        disabled={!canSpin || isSpinning}
        className={`
          px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 min-w-[240px] relative overflow-hidden
          ${canSpin && !isSpinning 
            ? 'bg-gradient-to-r from-primary via-primary to-accent text-white hover:scale-105 active:scale-95 shadow-2xl hover:shadow-glow transform-gpu' 
            : 'btn-disabled'
          }
        `}
      >
        {canSpin && !isSpinning && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
        )}
        <span className="relative z-10 flex items-center justify-center space-x-2">
          {isSpinning && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          <span>{isSpinning ? 'SPINNING...' : canSpin ? 'SPIN NOW!' : 'COOLDOWN ACTIVE'}</span>
        </span>
      </button>
    </div>
  )
}
