import { cn } from "@/lib/utils"
import { LEAD_STATUS_CONFIG, CAMPAIGN_STATUS_CONFIG, type LeadStatus, type CampaignStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: LeadStatus | CampaignStatus
  type: "lead" | "campaign"
  className?: string
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const config = type === "lead" 
    ? LEAD_STATUS_CONFIG[status as LeadStatus] 
    : CAMPAIGN_STATUS_CONFIG[status as CampaignStatus]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}
