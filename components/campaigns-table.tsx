"use client"

import Link from "next/link"
import { Campaign } from "@/lib/types"
import { StatusBadge } from "@/components/status-badge"
import { ChevronRight, TrendingUp, MousePointerClick, Eye } from "lucide-react"

interface CampaignsTableProps {
  campaigns: Campaign[]
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

function formatPercent(num: number): string {
  return `${(num * 100).toFixed(2)}%`
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <p className="text-muted-foreground">No hay campañas disponibles</p>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Campaña
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Presupuesto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Gastado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Impresiones
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                CTR
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Conversiones
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                    {campaign.objective && (
                      <p className="text-xs text-muted-foreground capitalize">{campaign.objective.replace("_", " ")}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={campaign.status} type="campaign" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <p className="text-sm text-foreground">{formatCurrency(campaign.budget)}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <p className="text-sm text-foreground">{formatCurrency(campaign.spent)}</p>
                  <p className="text-xs text-muted-foreground">
                    {((campaign.spent / campaign.budget) * 100).toFixed(0)}%
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <p className="text-sm text-foreground">{formatNumber(campaign.impressions)}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <p className="text-sm text-foreground">{formatNumber(campaign.clicks)}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <p className="text-sm text-foreground">{formatPercent(campaign.ctr)}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <p className="text-sm font-medium text-foreground">{campaign.conversions}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                  >
                    Ver
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden divide-y divide-border">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/campaigns/${campaign.id}`}
            className="block p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground truncate">{campaign.name}</p>
                  <StatusBadge status={campaign.status} type="campaign" />
                </div>
                {campaign.objective && (
                  <p className="text-sm text-muted-foreground capitalize">
                    {campaign.objective.replace("_", " ")}
                  </p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Eye className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm font-medium text-foreground">{formatNumber(campaign.impressions)}</p>
                <p className="text-xs text-muted-foreground">Impresiones</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <MousePointerClick className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm font-medium text-foreground">{formatNumber(campaign.clicks)}</p>
                <p className="text-xs text-muted-foreground">Clicks</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm font-medium text-foreground">{campaign.conversions}</p>
                <p className="text-xs text-muted-foreground">Conversiones</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Gastado: {formatCurrency(campaign.spent)}</span>
              <span className="text-muted-foreground">de {formatCurrency(campaign.budget)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
