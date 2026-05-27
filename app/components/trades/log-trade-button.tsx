'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { LogTradeModal } from './log-trade-modal'

export function LogTradeButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-anchor px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Log Trade
      </button>
      
      <LogTradeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
