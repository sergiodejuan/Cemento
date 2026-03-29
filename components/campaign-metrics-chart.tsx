"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Campaign } from "@/lib/types"

interface CampaignMetricsChartProps {
  campaigns: Campaign[]
}

export function CampaignMetricsChart({ campaigns }: CampaignMetricsChartProps) {
  const chartData = campaigns.slice(0, 5).map((campaign) => ({
    name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + "..." : campaign.name,
    conversiones: campaign.conversions,
    clicks: campaign.clicks,
  }))

  if (chartData.length === 0) {
    return (
      <div className="bg-background border border-border rounded-xl p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Rendimiento de Campañas</h3>
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No hay datos disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">Rendimiento de Campañas</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="conversiones" fill="#10b981" radius={[0, 4, 4, 0]} name="Conversiones" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
