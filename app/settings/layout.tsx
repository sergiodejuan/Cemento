"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Users, Webhook, Shield, Key } from "lucide-react"

const settingsNavigation = [
  { name: "Mi Perfil", href: "/settings", icon: User },
  { name: "Seguridad", href: "/settings/security", icon: Shield },
  { name: "Usuarios", href: "/settings/users", icon: Users },
  { name: "Integraciones", href: "/settings/integrations", icon: Webhook },
  { name: "API Keys", href: "/settings/api-keys", icon: Key },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Ajustes</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu cuenta, usuarios e integraciones
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings sidebar */}
        <nav className="lg:w-56 flex-shrink-0">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {settingsNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
