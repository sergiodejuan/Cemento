"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LEAD_STATUS_CONFIG, type LeadStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { updateLeadStatus } from "@/app/actions"
import { Spinner } from "@/components/ui/spinner"

interface LeadStatusUpdaterProps {
  leadId: string
  currentStatus: LeadStatus
}

const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"]

export function LeadStatusUpdater({ leadId, currentStatus }: LeadStatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStatusChange = (status: LeadStatus) => {
    if (status === currentStatus || isPending) return

    setSelectedStatus(status)
    startTransition(async () => {
      await updateLeadStatus(leadId, currentStatus, status)
      router.refresh()
    })
  }

  return (
    <div className="space-y-2">
      {STATUS_ORDER.map((status) => {
        const config = LEAD_STATUS_CONFIG[status]
        const isSelected = selectedStatus === status
        const isCurrent = currentStatus === status

        return (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={isPending || isCurrent}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all",
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:bg-muted",
              (isPending || isCurrent) && "opacity-70 cursor-not-allowed"
            )}
          >
            <span>{config.label}</span>
            {isPending && selectedStatus === status && (
              <Spinner className="h-4 w-4" />
            )}
            {isCurrent && !isPending && (
              <span className="text-xs opacity-60">Actual</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
