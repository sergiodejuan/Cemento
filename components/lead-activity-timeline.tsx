import { LeadActivity } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowRight, MessageSquare, Mail, Phone, Calendar } from "lucide-react"

interface LeadActivityTimelineProps {
  activities: LeadActivity[]
}

const ACTIVITY_ICONS: Record<LeadActivity["activity_type"], typeof ArrowRight> = {
  status_change: ArrowRight,
  note: MessageSquare,
  email: Mail,
  call: Phone,
  meeting: Calendar,
}

export function LeadActivityTimeline({ activities }: LeadActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No hay actividad registrada
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = ACTIVITY_ICONS[activity.activity_type]
        const isLast = index === activities.length - 1

        return (
          <div key={activity.id} className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[15px] top-8 w-px h-[calc(100%+8px)] bg-border" />
            )}

            {/* Icon */}
            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-4">
              <p className="text-sm text-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(activity.created_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
