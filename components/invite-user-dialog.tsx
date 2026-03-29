"use client"

import { useState } from "react"
import { X, UserPlus, Loader2, Check, Copy } from "lucide-react"

export function InviteUserDialog() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const signupUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/auth/signup`
    : "/auth/signup"

  const copyLink = () => {
    navigator.clipboard.writeText(signupUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors flex items-center gap-2"
      >
        <UserPlus className="h-4 w-4" />
        Invitar usuario
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Invitar usuario</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Comparte este enlace con la persona que quieres invitar para que se registre en el CRM.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={signupUrl}
                  readOnly
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-muted text-foreground text-sm"
                />
                <button
                  onClick={copyLink}
                  className="px-4 py-2.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Nota:</strong> Los nuevos usuarios tendrán rol de &quot;Usuario&quot; por defecto. Puedes cambiar su rol después desde esta sección.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
