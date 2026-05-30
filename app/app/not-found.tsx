import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper text-center px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">404</p>
      <h1 className="font-display text-3xl font-medium text-anchor">Page not found</h1>
      <p className="text-sm text-ink-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/dashboard" className="mt-2 text-sm font-medium text-anchor underline underline-offset-4">
        Go to dashboard →
      </Link>
    </div>
  )
}
