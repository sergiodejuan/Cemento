import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PasswordForm } from "@/components/password-form"
import { LogoutButton } from "@/components/logout-button"

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Cambiar contraseña</h2>
        <PasswordForm />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Cerrar sesión</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Cierra tu sesión actual en este dispositivo
        </p>
        <LogoutButton />
      </div>

      <div className="bg-card border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Zona de peligro</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
        </p>
        <button
          disabled
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Eliminar cuenta
        </button>
      </div>
    </div>
  )
}
