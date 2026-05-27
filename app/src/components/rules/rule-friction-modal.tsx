'use client'

import { useState } from 'react'
import { cn } from '@/src/lib/utils'

interface RuleFrictionModalProps {
  ruleName: string
  ruleDescription: string
  onOverride: (reason: string) => void
  onCancel: () => void
}

export function RuleFrictionModal({
  ruleName,
  ruleDescription,
  onOverride,
  onCancel,
}: RuleFrictionModalProps) {
  const [reason, setReason] = useState('')
  const [step, setStep] = useState<'warn' | 'reason'>('warn')

  function handleContinue() {
    if (step === 'warn') {
      setStep('reason')
      return
    }
    onOverride(reason)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
      <div
        className="absolute inset-0 bg-anchor/20 backdrop-blur-[8px]"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-sm rounded-xl border border-rule bg-warning-surface p-6 shadow-raised">
        <div className="mb-4 flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-sand" />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">Rule check</p>
            <h2 className="mt-1 text-base font-semibold text-anchor">{ruleName}</h2>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-anchor">{ruleDescription}</p>

        {step === 'reason' && (
          <div className="mb-4">
            <label htmlFor="override-reason" className="mb-1.5 block text-sm font-medium text-anchor">
              Why are you overriding this rule?
            </label>
            <textarea
              id="override-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Strong setup with clear invalidation level"
              className={cn(
                'w-full rounded-control border border-rule bg-white px-3 py-2 text-sm text-anchor',
                'placeholder:text-ink-muted focus:border-anchor focus:outline-none focus:shadow-focus-ring',
                'resize-none transition-all duration-fast'
              )}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleContinue}
            disabled={step === 'reason' && !reason.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 'warn' ? 'Override and log reason' : 'Confirm override'}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost w-full">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
