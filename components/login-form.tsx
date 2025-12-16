"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, ArrowRight } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Login attempt:", { email, password })
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 rounded border-border" />
          <span>Remember me</span>
        </label>
        <a href="#" className="text-primary hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign In"}
        <ArrowRight size={18} />
      </button>

      <p className="text-center text-sm text-muted-foreground">
        New to Invexia?{" "}
        <a href="#" className="text-primary hover:underline">
          Request access
        </a>
      </p>
    </form>
  )
}
