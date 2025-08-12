
import { SpinPrize } from '../types'

export const SPIN_PRIZES: SpinPrize[] = [
  { id: '1', tokens: 10, name: '10 Spark', color: 'hsl(210, 80%, 50%)', probability: 0.3 },
  { id: '2', tokens: 25, name: '25 Spark', color: 'hsl(150, 60%, 50%)', probability: 0.25 },
  { id: '3', tokens: 50, name: '50 Spark', color: 'hsl(30, 90%, 60%)', probability: 0.2 },
  { id: '4', tokens: 100, name: '100 Spark', color: 'hsl(270, 70%, 60%)', probability: 0.15 },
  { id: '5', tokens: 250, name: '250 Spark', color: 'hsl(0, 80%, 60%)', probability: 0.08 },
  { id: '6', tokens: 500, name: 'MEGA 500!', color: 'hsl(45, 100%, 50%)', probability: 0.02 },
]

export function getRandomPrize(): SpinPrize {
  const random = Math.random()
  let cumulativeProbability = 0
  
  for (const prize of SPIN_PRIZES) {
    cumulativeProbability += prize.probability
    if (random <= cumulativeProbability) {
      return prize
    }
  }
  
  return SPIN_PRIZES[0] // fallback
}
