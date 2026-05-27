import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="text-center">
      <h1 className="font-display text-4xl font-medium text-foreground">Welcome to tradelog</h1>
      <p className="mt-4 text-base text-ink-muted leading-relaxed">
        Your MT5 trades. Your rules. AI that shows you what you can&apos;t see yourself.
      </p>
      <div className="mt-10">
        <Link
          href="/onboarding/language"
          className="inline-flex items-center justify-center rounded-lg bg-anchor px-8 py-2.5 text-sm font-medium text-paper transition hover:opacity-90"
        >
          Let&apos;s get started →
        </Link>
      </div>
    </div>
  )
}
