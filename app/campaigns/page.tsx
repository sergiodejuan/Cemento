import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { CampaignsTable } from "@/components/campaigns-table"
import { StatsCard } from "@/components/stats-card"
import { Megaphone, Play, Pause, CheckCircle } from "lucide-react"
import type { Campaign } from "@/lib/types"

export default async function CampaignsPage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  const typedCampaigns = (campaigns || []) as Campaign[]

  const stats = {
    total: typedCampaigns.length,
    active: typedCampaigns.filter((c) => c.status === "active").length,
    paused: typedCampaigns.filter((c) => c.status === "paused").length,
    completed: typedCampaigns.filter((c) => c.status === "completed").length,
  }

  const totalBudget = typedCampaigns.reduce((acc, c) => acc + Number(c.budget), 0)
  const totalSpent = typedCampaigns.reduce((acc, c) => acc + Number(c.spent), 0)

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Campañas</h1>
            <p className="text-muted-foreground mt-1">
              Monitorea el rendimiento de tus campañas Meta Ads
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Campañas" value={stats.total} icon={Megaphone} />
            <StatsCard title="Activas" value={stats.active} icon={Play} />
            <StatsCard title="Pausadas" value={stats.paused} icon={Pause} />
            <StatsCard title="Completadas" value={stats.completed} icon={CheckCircle} />
          </div>

          {/* Budget Overview */}
          <div className="bg-background border border-border rounded-xl p-6 mb-8">
            <h3 className="text-sm font-medium text-foreground mb-4">Resumen de Presupuesto</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  ${totalSpent.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground">Gastado</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border" />
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  ${totalBudget.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground">Presupuesto Total</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border" />
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {((totalSpent / totalBudget) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Utilizado</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all"
                style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Campaigns Table */}
          <CampaignsTable campaigns={typedCampaigns} />
        </div>
      </main>
    </div>
  )
}
