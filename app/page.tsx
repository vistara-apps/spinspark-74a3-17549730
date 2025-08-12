
'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  usePrimaryButton,
  useViewProfile,
} from '@coinbase/onchainkit/minikit'
import { SpinWheel } from './components/SpinWheel'
import { TokenDisplay } from './components/TokenDisplay'
import { LeaderboardEntry } from './components/LeaderboardEntry'
import { CooldownTimer } from './components/CooldownTimer'
import { PrizeNotification } from './components/PrizeNotification'
import { User, SpinPrize, LeaderboardEntry as LeaderboardEntryType } from './types'
import { getUser, createUser, saveUser, addSpinHistory, updateLeaderboard, getLeaderboard } from './utils/storage'
import { getRandomPrize } from './data/spinPrizes'
import { Trophy, Users, Sparkles, ExternalLink } from 'lucide-react'

export default function SpinSparkApp() {
  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [wonPrize, setWonPrize] = useState<SpinPrize | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryType[]>([])
  const [activeTab, setActiveTab] = useState<'spin' | 'leaderboard'>('spin')
  
  const addFrame = useAddFrame()
  const openUrl = useOpenUrl()
  const viewProfile = useViewProfile()
  
  // Initialize user and load data
  useEffect(() => {
    const userId = context?.user?.fid?.toString() || `guest_${Date.now()}`
    let user = getUser()
    
    if (!user || user.userId !== userId) {
      user = createUser(userId)
    }
    
    setCurrentUser(user)
    setLeaderboard(getLeaderboard())
  }, [context])
  
  // Set frame ready
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])
  
  // Primary button for quick actions
  usePrimaryButton(
    { text: activeTab === 'spin' ? 'VIEW LEADERBOARD' : 'BACK TO SPIN' },
    () => {
      setActiveTab(activeTab === 'spin' ? 'leaderboard' : 'spin')
    }
  )
  
  const canSpin = currentUser ? Date.now() >= currentUser.spinCooldownEnd : false
  
  const handleSpinComplete = useCallback((prize: SpinPrize) => {
    if (!currentUser) return
    
    const newTokens = currentUser.sparkTokens + prize.tokens
    const newCooldownEnd = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    
    const updatedUser: User = {
      ...currentUser,
      sparkTokens: newTokens,
      spinCooldownEnd: newCooldownEnd,
    }
    
    setCurrentUser(updatedUser)
    saveUser(updatedUser)
    
    // Add to spin history
    addSpinHistory({
      spinId: `spin_${Date.now()}`,
      userId: currentUser.userId,
      timestamp: Date.now(),
      prizeWon: prize.name,
      tokensEarned: prize.tokens,
    })
    
    // Update leaderboard
    updateLeaderboard(currentUser.userId, newTokens)
    setLeaderboard(getLeaderboard())
    
    setIsSpinning(false)
    setWonPrize(prize)
  }, [currentUser])
  
  const handleSpin = () => {
    if (!canSpin || isSpinning) return
    setIsSpinning(true)
  }
  
  const handleAddFrame = useCallback(async () => {
    const result = await addFrame()
    if (result) {
      console.log('Frame added:', result.url, result.token)
    }
  }, [addFrame])
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading SpinSpark...</p>
        </div>
      </div>
    )
  }
  
  const userRank = leaderboard.find(entry => entry.userId === currentUser.userId)?.rank || 0
  
  return (
    <div className="min-h-screen bg-bg">
      <div className="container-app py-lg">
        {/* Header */}
        <header className="flex justify-between items-center mb-xl">
          <div className="flex items-center space-x-sm">
            <Sparkles className="w-8 h-8 text-accent" />
            <h1 className="text-heading text-gradient">SpinSpark</h1>
          </div>
          
          <div className="flex items-center space-x-sm">
            {context && !context.client.added && (
              <button
                onClick={handleAddFrame}
                className="btn-secondary text-sm px-md py-sm"
              >
                SAVE
              </button>
            )}
            <button
              onClick={() => openUrl('https://base.org')}
              className="flex items-center space-x-1 text-primary text-sm font-semibold hover:text-primary/80"
            >
              <span>BASE</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </header>
        
        {/* Tab Navigation */}
        <div className="flex bg-surface rounded-lg p-1 mb-xl shadow-sm">
          <button
            onClick={() => setActiveTab('spin')}
            className={`flex-1 flex items-center justify-center space-x-2 py-md px-lg rounded-md transition-all duration-200 ${
              activeTab === 'spin' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Daily Spin</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 flex items-center justify-center space-x-2 py-md px-lg rounded-md transition-all duration-200 ${
              activeTab === 'leaderboard' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
        </div>
        
        {/* Content */}
        {activeTab === 'spin' ? (
          <div className="space-y-xl">
            {/* Token Display */}
            <TokenDisplay tokens={currentUser.sparkTokens} variant="detailed" />
            
            {/* Cooldown Timer */}
            {!canSpin && (
              <CooldownTimer
                endTime={currentUser.spinCooldownEnd}
                onComplete={() => {
                  const updatedUser = { ...currentUser, spinCooldownEnd: 0 }
                  setCurrentUser(updatedUser)
                  saveUser(updatedUser)
                }}
              />
            )}
            
            {/* Spin Wheel */}
            <div className="card text-center">
              <h2 className="text-heading mb-lg">Daily Spin Wheel</h2>
              <SpinWheel
                isSpinning={isSpinning}
                onSpinComplete={handleSpinComplete}
                canSpin={canSpin}
              />
              <p className="text-caption text-textSecondary mt-lg">
                {canSpin ? 'Spin to win Spark Tokens!' : 'Come back tomorrow for your next spin!'}
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-md">
              <div className="card text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-sm" />
                <p className="text-heading">#{userRank || '---'}</p>
                <p className="text-caption text-textSecondary">Your Rank</p>
              </div>
              <div className="card text-center">
                <Trophy className="w-6 h-6 text-accent mx-auto mb-sm" />
                <p className="text-heading">{leaderboard.length}</p>
                <p className="text-caption text-textSecondary">Total Players</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-lg">
            <div className="card">
              <h2 className="text-heading mb-lg flex items-center space-x-sm">
                <Trophy className="w-6 h-6 text-accent" />
                <span>Leaderboard</span>
              </h2>
              
              <div className="space-y-md">
                {leaderboard.slice(0, 10).map((entry) => (
                  <LeaderboardEntry
                    key={entry.userId}
                    entry={entry}
                    isCurrentUser={entry.userId === currentUser.userId}
                  />
                ))}
              </div>
              
              {leaderboard.length === 0 && (
                <div className="text-center py-xl">
                  <Users className="w-12 h-12 text-textSecondary mx-auto mb-md" />
                  <p className="text-textSecondary">No players yet. Be the first to spin!</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <footer className="text-center mt-xl pt-lg border-t border-gray-200">
          <button
            onClick={() => openUrl('https://docs.base.org/miniapps')}
            className="text-textSecondary text-caption hover:text-textPrimary transition-colors duration-200"
          >
            BUILT ON BASE WITH MINIKIT
          </button>
        </footer>
        
        {/* Prize Notification */}
        <PrizeNotification
          prize={wonPrize}
          onClose={() => setWonPrize(null)}
        />
      </div>
    </div>
  )
}
