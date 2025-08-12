
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
        {/* Wheel Container */}
        <div className="relative w-64 h-64">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-textPrimary"></div>
          </div>
          
          {/* Wheel */}
          <div 
            className={`relative w-full h-full rounded-full border-4 border-textPrimary shadow-lg overflow-hidden ${
              isSpinning ? 'animate-spin-wheel' : ''
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {SPIN_PRIZES.map((prize, index) => {
              const angle = (360 / SPIN_PRIZES.length) * index
              const nextAngle = (360 / SPIN_PRIZES.length) * (index + 1)
              
              return (
                <div
                  key={prize.id}
                  className="absolute w-full h-full flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    background: `conic-gradient(from ${angle}deg, ${prize.color} 0deg, ${prize.color} ${360 / SPIN_PRIZES.length}deg, transparent ${360 / SPIN_PRIZES.length}deg)`,
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`,
                  }}
                >
                  <div 
                    className="absolute text-center"
                    style={{
                      transform: `rotate(${angle + (360 / SPIN_PRIZES.length) / 2}deg) translateY(-80px)`,
                      transformOrigin: '50% 80px',
                    }}
                  >
                    <div style={{ transform: 'rotate(0deg)' }}>
                      {prize.name}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={!canSpin || isSpinning}
        className={`
          px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 min-w-[200px]
          ${canSpin && !isSpinning 
            ? 'btn-primary hover:scale-105 active:scale-95 shadow-glow' 
            : 'btn-disabled'
          }
        `}
      >
        {isSpinning ? 'SPINNING...' : canSpin ? 'SPIN NOW!' : 'COOLDOWN ACTIVE'}
      </button>
    </div>
  )
}
