"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, Check } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface ProfileFormProps {
  user: User
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.full_name || "")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })

    if (!error) {
      // Also update auth metadata
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
      setSuccess(true)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={user.email || ""}
          disabled
          className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground mt-1">El email no se puede cambiar</p>
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
          Nombre completo
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="Tu nombre"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar cambios"
          )}
        </button>
        {success && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <Check className="h-4 w-4" />
            Guardado
          </span>
        )}
      </div>
    </form>
  )
}
