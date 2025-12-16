import { DashboardLayout } from "@/components/dashboard-layout"
import { AuditLogsPage } from "@/components/audit-logs-page"

export default function AuditLogsRoute() {
  return (
    <DashboardLayout>
      <AuditLogsPage />
    </DashboardLayout>
  )
}
