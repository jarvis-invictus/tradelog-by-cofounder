'use client'

import { useState } from 'react'
import { JournalEntryModal } from './journal-entry-modal'

export function JournalEntryButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-anchor px-5 text-sm font-medium text-paper transition-all hover:bg-anchor/90 active:scale-[0.99]"
      >
        + New Entry
      </button>
      <JournalEntryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
