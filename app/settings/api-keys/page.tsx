import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Key, Info } from "lucide-react"

export default async function ApiKeysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona las claves de API para acceder a los endpoints del CRM
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 font-medium">API REST en desarrollo</p>
          <p className="text-sm text-blue-700 mt-1">
            Estamos trabajando en una API REST completa para que puedas integrar el CRM con tus aplicaciones. 
            Por ahora, utiliza los webhooks para enviar leads al CRM.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-muted rounded-lg">
            <Key className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Endpoints disponibles</h3>
            <p className="text-sm text-muted-foreground">Webhooks para recibir leads</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded">POST</span>
              <code className="text-sm text-foreground">/api/webhooks/[token]</code>
            </div>
            <p className="text-xs text-muted-foreground">
              Recibe leads desde Make, Zapier, formularios web, etc.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Configura tus webhooks desde la sección de{" "}
            <a href="/settings/integrations" className="text-foreground hover:underline font-medium">
              Integraciones
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
