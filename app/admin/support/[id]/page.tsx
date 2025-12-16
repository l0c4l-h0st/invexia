import { DashboardLayout } from "@/components/dashboard-layout"
import { TicketDetail } from "@/components/ticket-detail"

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <DashboardLayout>
      <TicketDetail ticketId={id} />
    </DashboardLayout>
  )
}
