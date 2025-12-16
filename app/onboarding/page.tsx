import { redirect } from "next/navigation"
import { checkOnboardingStatus } from "@/lib/actions/onboarding"
import { OnboardingForm } from "@/components/onboarding-form"

export default async function OnboardingPage() {
  const { needsOnboarding, entreprise } = await checkOnboardingStatus()

  if (!needsOnboarding) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <OnboardingForm entreprise={entreprise} />
    </div>
  )
}
