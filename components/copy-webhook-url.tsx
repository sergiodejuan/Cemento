"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CopyWebhookUrlProps {
  token: string
}

export function CopyWebhookUrl({ token }: CopyWebhookUrlProps) {
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const fullUrl = `${baseUrl}/api/webhooks/${token}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm text-foreground truncate">
        {fullUrl}
      </code>
      <button
        onClick={handleCopy}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg"
        title="Copiar URL"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
