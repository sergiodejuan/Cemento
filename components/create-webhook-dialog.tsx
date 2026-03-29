"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import { createWebhook } from "@/app/actions"

interface Campaign {
  id: string
  name: string
}

interface CreateWebhookDialogProps {
  campaigns: Campaign[]
}

export function CreateWebhookDialog({ campaigns }: CreateWebhookDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    default_campaign_id: "",
    default_source: "webhook",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await createWebhook({
      name: formData.name,
      default_campaign_id: formData.default_campaign_id || null,
      default_source: formData.default_source,
    })

    setIsLoading(false)
    setIsOpen(false)
    setFormData({ name: "", default_campaign_id: "", default_source: "webhook" })
    router.refresh()
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Nuevo Webhook
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 z-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background border border-border rounded-xl shadow-lg w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">Crear Webhook</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Nombre del Webhook
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Make - Landing Principal"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Campaña por Defecto
              </label>
              <select
                value={formData.default_campaign_id}
                onChange={(e) => setFormData({ ...formData, default_campaign_id: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="">Sin campaña asignada</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Se usará si el payload no incluye campaign_id
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Source por Defecto
              </label>
              <input
                type="text"
                required
                value={formData.default_source}
                onChange={(e) => setFormData({ ...formData, default_source: e.target.value })}
                placeholder="Ej: make-landing, zapier, web-form"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Identifica el origen del lead
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creando..." : "Crear Webhook"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
