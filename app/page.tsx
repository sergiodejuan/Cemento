import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { StatsCard } from "@/components/stats-card"
import { LeadsTable } from "@/components/leads-table"
import { LeadStatusChart } from "@/components/lead-status-chart"
import { CampaignMetricsChart } from "@/components/campaign-metrics-chart"
import { Users, Megaphone, TrendingUp, DollarSign } from "lucide-react"
import type { Lead, Campaign, LeadStatus } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ data: leads }, { data: campaigns }] = await Promise.all([
    supabase.from("leads").select("*, campaign:campaigns(*)").order("created_at", { ascending: false }),
    supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
  ])

  const typedLeads = (leads || []) as Lead[]
  const typedCampaigns = (campaigns || []) as Campaign[]

  // Calculate stats
  const totalLeads = typedLeads.length
  const newLeads = typedLeads.filter((l) => l.status === "new").length
  const totalConversions = typedCampaigns.reduce((acc, c) => acc + c.conversions, 0)
  const totalSpent = typedCampaigns.reduce((acc, c) => acc + Number(c.spent), 0)
  const activeCampaigns = typedCampaigns.filter((c) => c.status === "active").length

  // Lead status distribution
  const statusCounts: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  }
  typedLeads.forEach((lead) => {
    statusCounts[lead.status]++
  })
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as LeadStatus,
    count,
  }))

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Resumen de tus campañas Meta Ads y leads
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Leads"
              value={totalLeads}
              subtitle={`${newLeads} nuevos`}
              icon={Users}
            />
            <StatsCard
              title="Campañas Activas"
              value={activeCampaigns}
              subtitle={`de ${typedCampaigns.length} totales`}
              icon={Megaphone}
            />
            <StatsCard
              title="Conversiones"
              value={totalConversions}
              icon={TrendingUp}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatsCard
              title="Gasto Total"
              value={`$${totalSpent.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              icon={DollarSign}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <LeadStatusChart data={statusData} />
            <CampaignMetricsChart campaigns={typedCampaigns} />
          </div>

          {/* Recent Leads */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">Leads Recientes</h2>
            </div>
            <LeadsTable leads={typedLeads.slice(0, 5)} />
          </div>
        </div>
      </main>
    </div>
  )
}
