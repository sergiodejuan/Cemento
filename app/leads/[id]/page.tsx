import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { StatusBadge } from "@/components/status-badge"
import { LeadStatusUpdater } from "@/components/lead-status-updater"
import { LeadActivityTimeline } from "@/components/lead-activity-timeline"
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Calendar, Megaphone } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import type { Lead, LeadActivity, Campaign } from "@/lib/types"

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: lead }, { data: activities }] = await Promise.all([
    supabase.from("leads").select("*, campaign:campaigns(*)").eq("id", id).single(),
    supabase.from("lead_activities").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ])

  if (!lead) {
    notFound()
  }

  const typedLead = lead as Lead & { campaign: Campaign | null }
  const typedActivities = (activities || []) as LeadActivity[]

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {/* Back Button */}
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Leads
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="bg-background border border-border rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                      {typedLead.first_name} {typedLead.last_name}
                    </h1>
                    {typedLead.job_title && (
                      <p className="text-muted-foreground mt-1">{typedLead.job_title}</p>
                    )}
                  </div>
                  <StatusBadge status={typedLead.status} type="lead" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${typedLead.email}`}
                        className="text-sm text-foreground hover:underline"
                      >
                        {typedLead.email}
                      </a>
                    </div>
                  </div>

                  {typedLead.phone && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Teléfono</p>
                        <a
                          href={`tel:${typedLead.phone}`}
                          className="text-sm text-foreground hover:underline"
                        >
                          {typedLead.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {typedLead.company && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Empresa</p>
                        <p className="text-sm text-foreground">{typedLead.company}</p>
                      </div>
                    </div>
                  )}

                  {typedLead.job_title && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cargo</p>
                        <p className="text-sm text-foreground">{typedLead.job_title}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Card */}
              {typedLead.notes && (
                <div className="bg-background border border-border rounded-xl p-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Notas</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {typedLead.notes}
                  </p>
                </div>
              )}

              {/* Activity Timeline */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Actividad</h3>
                <LeadActivityTimeline activities={typedActivities} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Update Status */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Actualizar Estado</h3>
                <LeadStatusUpdater leadId={typedLead.id} currentStatus={typedLead.status} />
              </div>

              {/* Campaign Info */}
              {typedLead.campaign && (
                <div className="bg-background border border-border rounded-xl p-6">
                  <h3 className="text-sm font-medium text-foreground mb-4">Campaña Origen</h3>
                  <Link
                    href={`/campaigns/${typedLead.campaign.id}`}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="p-2 bg-background rounded-lg border border-border">
                      <Megaphone className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {typedLead.campaign.name}
                      </p>
                      <StatusBadge status={typedLead.campaign.status} type="campaign" />
                    </div>
                  </Link>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Información</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Creado</p>
                      <p className="text-sm text-foreground">
                        {format(new Date(typedLead.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({formatDistanceToNow(new Date(typedLead.created_at), { addSuffix: true, locale: es })})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">ID</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lead ID</p>
                      <p className="text-sm text-foreground font-mono truncate max-w-[180px]">
                        {typedLead.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
