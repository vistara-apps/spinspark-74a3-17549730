
'use client'

import { MiniKitProvider } from '@coinbase/onchainkit/minikit'
import { base } from 'wagmi/chains'
import type { ReactNode } from 'react'

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'base',
          name: 'SpinSpark',
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  )
}
