import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { StatusBadge } from "@/components/status-badge"
import { LeadsTable } from "@/components/leads-table"
import { StatsCard } from "@/components/stats-card"
import { ArrowLeft, Eye, MousePointerClick, TrendingUp, DollarSign, Target, Calendar } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Campaign, Lead } from "@/lib/types"

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num)
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: campaign }, { data: leads }] = await Promise.all([
    supabase.from("campaigns").select("*").eq("id", id).single(),
    supabase.from("leads").select("*").eq("campaign_id", id).order("created_at", { ascending: false }),
  ])

  if (!campaign) {
    notFound()
  }

  const typedCampaign = campaign as Campaign
  const typedLeads = (leads || []) as Lead[]

  const budgetUsedPercent = (Number(typedCampaign.spent) / Number(typedCampaign.budget)) * 100

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {/* Back Button */}
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Campañas
          </Link>

          {/* Header */}
          <div className="bg-background border border-border rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{typedCampaign.name}</h1>
                {typedCampaign.objective && (
                  <p className="text-muted-foreground mt-1 capitalize">
                    {typedCampaign.objective.replace("_", " ")}
                  </p>
                )}
              </div>
              <StatusBadge status={typedCampaign.status} type="campaign" />
            </div>

            {/* Date Range */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {typedCampaign.start_date
                    ? format(new Date(typedCampaign.start_date), "d MMM yyyy", { locale: es })
                    : "Sin fecha"}{" "}
                  -{" "}
                  {typedCampaign.end_date
                    ? format(new Date(typedCampaign.end_date), "d MMM yyyy", { locale: es })
                    : "En curso"}
                </span>
              </div>
              {typedCampaign.meta_campaign_id && (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-mono text-xs">{typedCampaign.meta_campaign_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Impresiones"
              value={formatNumber(typedCampaign.impressions)}
              icon={Eye}
            />
            <StatsCard
              title="Clicks"
              value={formatNumber(typedCampaign.clicks)}
              subtitle={`CTR: ${(Number(typedCampaign.ctr) * 100).toFixed(2)}%`}
              icon={MousePointerClick}
            />
            <StatsCard
              title="Conversiones"
              value={typedCampaign.conversions}
              icon={TrendingUp}
            />
            <StatsCard
              title="CPC"
              value={formatCurrency(Number(typedCampaign.cpc))}
              subtitle={`CPM: ${formatCurrency(Number(typedCampaign.cpm))}`}
              icon={DollarSign}
            />
          </div>

          {/* Budget Card */}
          <div className="bg-background border border-border rounded-xl p-6 mb-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Presupuesto</h3>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-3xl font-semibold text-foreground">
                  {formatCurrency(Number(typedCampaign.spent))}
                </p>
                <p className="text-sm text-muted-foreground">
                  de {formatCurrency(Number(typedCampaign.budget))} presupuestado
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-foreground">
                  {budgetUsedPercent.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">utilizado</p>
              </div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all"
                style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Leads from this Campaign */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">
                Leads de esta Campaña ({typedLeads.length})
              </h2>
            </div>
            <LeadsTable leads={typedLeads} />
          </div>
        </div>
      </main>
    </div>
  )
}
