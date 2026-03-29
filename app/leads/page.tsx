import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { LeadsTable } from "@/components/leads-table"
import { StatsCard } from "@/components/stats-card"
import { Users, UserPlus, UserCheck, UserX } from "lucide-react"
import type { Lead } from "@/lib/types"

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from("leads")
    .select("*, campaign:campaigns(*)")
    .order("created_at", { ascending: false })

  const typedLeads = (leads || []) as Lead[]

  const stats = {
    total: typedLeads.length,
    new: typedLeads.filter((l) => l.status === "new").length,
    qualified: typedLeads.filter((l) => l.status === "qualified").length,
    converted: typedLeads.filter((l) => l.status === "converted").length,
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona todos tus leads de campañas Meta Ads
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total" value={stats.total} icon={Users} />
            <StatsCard title="Nuevos" value={stats.new} icon={UserPlus} />
            <StatsCard title="Calificados" value={stats.qualified} icon={UserCheck} />
            <StatsCard title="Convertidos" value={stats.converted} icon={UserX} />
          </div>

          {/* Leads Table */}
          <LeadsTable leads={typedLeads} />
        </div>
      </main>
    </div>
  )
}
