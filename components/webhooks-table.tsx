"use client"

import { Webhook } from "@/lib/types"
import { Copy, Check, Trash2, ToggleLeft, ToggleRight, Eye } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteWebhook, toggleWebhookStatus } from "@/app/actions"
import Link from "next/link"

interface WebhooksTableProps {
  webhooks: Webhook[]
}

export function WebhooksTable({ webhooks }: WebhooksTableProps) {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const copyToClipboard = async (token: string, id: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${baseUrl}/api/webhooks/${token}`
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    await toggleWebhookStatus(id, !currentStatus)
    router.refresh()
    setLoadingId(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este webhook?")) {
      setLoadingId(id)
      await deleteWebhook(id)
      router.refresh()
      setLoadingId(null)
    }
  }

  if (webhooks.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No hay webhooks configurados</p>
        <p className="text-sm text-muted-foreground mt-1">
          Crea tu primer webhook para comenzar a recibir leads
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Nombre
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              URL del Webhook
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Campaña Default
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Source
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Estado
            </th>
            <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {webhooks.map((webhook) => (
            <tr key={webhook.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4">
                <span className="font-medium text-foreground">{webhook.name}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground truncate max-w-[200px]">
                    /api/webhooks/{webhook.token.slice(0, 8)}...
                  </code>
                  <button
                    onClick={() => copyToClipboard(webhook.token, webhook.id)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copiar URL completa"
                  >
                    {copiedId === webhook.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                  {webhook.campaign?.name || "Sin asignar"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                  {webhook.default_source}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  webhook.is_active 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {webhook.is_active ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/integrations/${webhook.id}`}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    title="Ver logs"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleToggle(webhook.id, webhook.is_active)}
                    disabled={loadingId === webhook.id}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    title={webhook.is_active ? "Desactivar" : "Activar"}
                  >
                    {webhook.is_active ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(webhook.id)}
                    disabled={loadingId === webhook.id}
                    className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
