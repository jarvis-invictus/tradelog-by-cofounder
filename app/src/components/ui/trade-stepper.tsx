import { cn } from '@/src/lib/utils'
import { Check } from 'lucide-react'

const STEPS = ['Synced', 'Analyzed', 'Rule Check', 'Journaled'] as const
type Step = (typeof STEPS)[number]

interface TradeStepperProps {
  currentStep: Step
}

export function TradeStepper({ currentStep }: TradeStepperProps) {
  const currentIndex = STEPS.indexOf(currentStep)

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex
        const isActive = index === currentIndex
        const isPending = index > currentIndex

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full transition-all',
                  isDone && 'bg-sage',
                  isActive && 'bg-lavender',
                  isPending && 'bg-neutral border border-rule'
                )}
              >
                {isDone && <Check className="h-3 w-3 text-anchor" />}
                {isActive && <span className="h-2 w-2 rounded-full bg-anchor" />}
              </div>
              <span
                className={cn(
                  'font-mono text-[9px] uppercase tracking-wider',
                  isDone && 'text-sage',
                  isActive && 'text-anchor font-medium',
                  isPending && 'text-ink-muted'
                )}
              >
                {step}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-px w-8 mx-1 -mt-4',
                  index < currentIndex ? 'bg-sage' : 'bg-rule'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
