import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UsersTable } from "@/components/users-table"
import { InviteUserDialog } from "@/components/invite-user-dialog"

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Usuarios</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los usuarios que tienen acceso al CRM
          </p>
        </div>
        <InviteUserDialog />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <UsersTable users={profiles || []} currentUserId={user.id} />
      </div>
    </div>
  )
}
