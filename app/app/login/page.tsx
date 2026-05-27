import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm mx-auto mt-24">
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          <div className="text-center">
            <h1 className="font-display text-2xl font-medium text-foreground">tradelog</h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-ink-muted">
              Discipline &middot; Insight &middot; Growth
            </p>
          </div>
          <div className="border-t border-border my-6" />
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
