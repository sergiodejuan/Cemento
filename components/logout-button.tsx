"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Cerrando sesión...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </>
      )}
    </button>
  )
}
