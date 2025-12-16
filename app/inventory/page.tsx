import { DashboardLayout } from "@/components/dashboard-layout"
import { InventoryPage } from "@/components/inventory-page"

export default function InventoryRoute() {
  return (
    <DashboardLayout>
      <InventoryPage />
    </DashboardLayout>
  )
}
