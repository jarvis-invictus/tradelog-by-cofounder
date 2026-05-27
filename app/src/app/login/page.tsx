import Link from 'next/link'
import { LoginForm } from '@/src/components/auth/login-form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-medium text-anchor">tradelog</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-muted">
            Discipline &middot; Insight &middot; Growth
          </p>
        </div>

        <div className="card p-6">
          <h2 className="mb-6 text-lg font-semibold text-anchor">Sign in to your account</h2>
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-sm text-ink-muted">
          No account?{' '}
          <Link href="/signup" className="text-anchor underline underline-offset-4 hover:text-anchor/70">
            Create one free
          </Link>
        </p>
      </div>
    </main>
  )
}
