import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatInr(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(Math.abs(amount))
  const sign = amount >= 0 ? '+' : '\u2212'
  return `${sign}\u20B9\u200A${formatted}`
}

export function formatInrPlain(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatPips(pips: number): string {
  const sign = pips >= 0 ? '+' : ''
  return `${sign}${pips.toFixed(1)} pips`
}

export function formatLot(lot: number): string {
  return `${lot.toFixed(2)} lot`
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(dateStr))
}

export function formatShortDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}
