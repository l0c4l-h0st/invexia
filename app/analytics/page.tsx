import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AnalyticsRoute() {
  return (
    <DashboardLayout>
      <AnalyticsDashboard />
    </DashboardLayout>
  )
}
