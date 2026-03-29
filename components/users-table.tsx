"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { MoreHorizontal, Shield, User } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

interface UsersTableProps {
  users: Profile[]
  currentUserId: string
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No hay usuarios registrados
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fecha registro
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">
                      {user.full_name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user.full_name || "Sin nombre"}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs text-muted-foreground">(Tú)</span>
                      )}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role === "admin" ? (
                    <Shield className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {user.role === "admin" ? "Admin" : "Usuario"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {format(new Date(user.created_at), "d MMM yyyy", { locale: es })}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="relative inline-block" ref={openMenu === user.id ? menuRef : null}>
                  <button
                    onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    disabled={user.id === currentUserId}
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {openMenu === user.id && user.id !== currentUserId && (
                    <div className="absolute right-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-10">
                      <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors rounded-t-lg">
                        Cambiar rol
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg">
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
