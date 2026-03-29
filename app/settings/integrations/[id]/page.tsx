import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Copy, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { WebhookLog } from "@/lib/types"
import { CopyWebhookUrl } from "@/components/copy-webhook-url"

export default async function WebhookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: webhook, error } = await supabase
    .from("webhooks")
    .select("*, campaign:campaigns(name)")
    .eq("id", id)
    .single()

  if (error || !webhook) {
    notFound()
  }

  const { data: logs } = await supabase
    .from("webhook_logs")
    .select("*, lead:leads(first_name, last_name, email)")
    .eq("webhook_id", id)
    .order("created_at", { ascending: false })
    .limit(50)

  const { count: totalLogs } = await supabase
    .from("webhook_logs")
    .select("*", { count: "exact", head: true })
    .eq("webhook_id", id)

  const { count: successLogs } = await supabase
    .from("webhook_logs")
    .select("*", { count: "exact", head: true })
    .eq("webhook_id", id)
    .eq("status", "success")

  const { count: errorLogs } = await supabase
    .from("webhook_logs")
    .select("*", { count: "exact", head: true })
    .eq("webhook_id", id)
    .eq("status", "error")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/settings/integrations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Integraciones
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{webhook.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Logs y configuración del webhook
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            webhook.is_active 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          }`}>
            {webhook.is_active ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Webhook Info */}
      <div className="bg-background border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Configuración</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              URL del Webhook
            </label>
            <CopyWebhookUrl token={webhook.token} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Campaña por Defecto
            </label>
            <p className="text-foreground">
              {webhook.campaign?.name || "Sin asignar"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Source por Defecto
            </label>
            <p className="text-foreground">{webhook.default_source}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Creado
            </label>
            <p className="text-foreground">
              {new Date(webhook.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-3xl font-semibold text-foreground mt-1">{totalLogs || 0}</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Exitosos</p>
          <p className="text-3xl font-semibold text-green-600 mt-1">{successLogs || 0}</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Errores</p>
          <p className="text-3xl font-semibold text-red-600 mt-1">{errorLogs || 0}</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-background border border-border rounded-xl">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Historial de Requests</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Últimos 50 requests recibidos
          </p>
        </div>

        {logs && logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Fecha
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Estado
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Lead
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Payload
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log: WebhookLog & { lead?: { first_name: string; last_name: string; email: string } }) => (
                  <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString("es-ES")}
                    </td>
                    <td className="px-6 py-4">
                      {log.status === "success" ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Exitoso</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-600">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm" title={log.error_message || ""}>
                            Error
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {log.lead_id && log.lead ? (
                        <Link 
                          href={`/leads/${log.lead_id}`}
                          className="text-sm text-foreground hover:underline inline-flex items-center gap-1"
                        >
                          {log.lead.first_name} {log.lead.last_name}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <details className="cursor-pointer">
                        <summary className="text-sm text-muted-foreground hover:text-foreground">
                          Ver payload
                        </summary>
                        <pre className="mt-2 text-xs bg-muted p-3 rounded-lg overflow-x-auto max-w-md">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No hay requests registrados</p>
            <p className="text-sm text-muted-foreground mt-1">
              Los requests aparecerán aquí cuando envíes datos al webhook
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
