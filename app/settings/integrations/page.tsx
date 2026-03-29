import { createClient } from "@/lib/supabase/server"
import { Webhook } from "@/lib/types"
import { Webhook as WebhookIcon, Plus, ExternalLink } from "lucide-react"
import { WebhooksTable } from "@/components/webhooks-table"
import { CreateWebhookDialog } from "@/components/create-webhook-dialog"
import { StatsCard } from "@/components/stats-card"

export default async function IntegrationsPage() {
  const supabase = await createClient()

  const { data: webhooks } = await supabase
    .from("webhooks")
    .select("*, campaign:campaigns(name)")
    .order("created_at", { ascending: false })

  const { count: totalWebhooks } = await supabase
    .from("webhooks")
    .select("*", { count: "exact", head: true })

  const { count: activeWebhooks } = await supabase
    .from("webhooks")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: totalRequests } = await supabase
    .from("webhook_logs")
    .select("*", { count: "exact", head: true })

  const { count: successfulRequests } = await supabase
    .from("webhook_logs")
    .select("*", { count: "exact", head: true })
    .eq("status", "success")

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, name")
    .order("name")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Integraciones</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configura webhooks para recibir leads desde Make, Zapier o tu web
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Webhooks Totales"
          value={totalWebhooks || 0}
          icon={WebhookIcon}
        />
        <StatsCard
          title="Webhooks Activos"
          value={activeWebhooks || 0}
          icon={WebhookIcon}
          trend={totalWebhooks ? { value: Math.round((activeWebhooks || 0) / totalWebhooks * 100), isPositive: true } : undefined}
        />
        <StatsCard
          title="Requests Totales"
          value={totalRequests || 0}
          icon={ExternalLink}
        />
        <StatsCard
          title="Requests Exitosos"
          value={successfulRequests || 0}
          icon={ExternalLink}
          trend={totalRequests ? { value: Math.round((successfulRequests || 0) / totalRequests * 100), isPositive: true } : undefined}
        />
      </div>

      {/* Documentation */}
      <div className="bg-muted/30 border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Documentación de la API</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium text-foreground mb-2">Endpoint</h3>
            <code className="bg-muted px-3 py-2 rounded-lg text-foreground block">
              POST {typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/[TOKEN]
            </code>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">Campos aceptados</h3>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-muted-foreground">{`{
  "first_name": "Juan",        // o "firstName" o "name"
  "last_name": "García",       // o "lastName"
  "email": "juan@email.com",   // o "Email" o "correo"
  "phone": "+34612345678",     // o "Phone" o "telefono"
  "company": "Empresa SL",     // o "Company" o "empresa"
  "job_title": "Director",     // o "jobTitle" o "cargo"
  "campaign_id": "uuid",       // opcional, usa el default del webhook
  "source": "landing-page",    // opcional, usa el default del webhook
  "notes": "Mensaje...",       // o "message" o "mensaje"
  "meta_lead_id": "12345"      // o "leadgen_id" para Meta Ads
}`}</pre>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">Configuración en Make.com</h3>
            <ol className="list-decimal list-inside text-muted-foreground space-y-1">
              <li>Crea un nuevo escenario con el trigger de Meta Lead Ads</li>
              <li>Añade un módulo HTTP {">"} Make a request</li>
              <li>Configura URL: tu webhook URL completa</li>
              <li>Método: POST</li>
              <li>Body type: JSON</li>
              <li>Mapea los campos del lead de Meta al formato JSON</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Webhooks List */}
      <div className="bg-background border border-border rounded-xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">Webhooks</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tus endpoints de integración
            </p>
          </div>
          <CreateWebhookDialog campaigns={campaigns || []} />
        </div>
        <WebhooksTable webhooks={(webhooks as Webhook[]) || []} />
      </div>
    </div>
  )
}
