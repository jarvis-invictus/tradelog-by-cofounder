'use client'

import { useState } from 'react'
import { AddRuleModal } from './add-rule-modal'

export function AddRuleButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        + Add rule
      </button>
      <AddRuleModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
