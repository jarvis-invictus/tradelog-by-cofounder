import Link from 'next/link'
import { SignupForm } from '@/src/components/auth/signup-form'

export default function SignupPage() {
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
          <h2 className="mb-6 text-lg font-semibold text-anchor">Create your free account</h2>
          <SignupForm />
        </div>

        <p className="mt-4 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-anchor underline underline-offset-4 hover:text-anchor/70">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
