import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">⚡</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Invexia</h1>
            <p className="text-muted-foreground">Enterprise Inventory Management</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass rounded-2xl border border-border/50 p-8">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Protected by enterprise-grade security and encryption
        </p>
      </div>
    </div>
  )
}
