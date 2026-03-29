"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { LEAD_STATUS_CONFIG, type LeadStatus } from "@/lib/types"

interface LeadStatusChartProps {
  data: { status: LeadStatus; count: number }[]
}

const COLORS: Record<LeadStatus, string> = {
  new: "#3b82f6",
  contacted: "#eab308",
  qualified: "#22c55e",
  converted: "#10b981",
  lost: "#ef4444",
}

export function LeadStatusChart({ data }: LeadStatusChartProps) {
  const chartData = data.map((item) => ({
    name: LEAD_STATUS_CONFIG[item.status].label,
    value: item.count,
    color: COLORS[item.status],
  }))

  if (chartData.every((item) => item.value === 0)) {
    return (
      <div className="bg-background border border-border rounded-xl p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Leads por Estado</h3>
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No hay datos disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">Leads por Estado</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
