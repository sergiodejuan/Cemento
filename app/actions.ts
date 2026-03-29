"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { LEAD_STATUS_CONFIG, type LeadStatus } from "@/lib/types"

export async function updateLeadStatus(
  leadId: string,
  previousStatus: LeadStatus,
  newStatus: LeadStatus
) {
  const supabase = await createClient()

  // Update lead status
  const { error: updateError } = await supabase
    .from("leads")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", leadId)

  if (updateError) {
    throw new Error("Error al actualizar el estado del lead")
  }

  // Create activity record
  const { error: activityError } = await supabase.from("lead_activities").insert({
    lead_id: leadId,
    activity_type: "status_change",
    description: `Estado cambiado de ${LEAD_STATUS_CONFIG[previousStatus].label} a ${LEAD_STATUS_CONFIG[newStatus].label}`,
    previous_value: previousStatus,
    new_value: newStatus,
  })

  if (activityError) {
    console.error("Error creating activity:", activityError)
  }

  revalidatePath(`/leads/${leadId}`)
  revalidatePath("/leads")
  revalidatePath("/")

  return { success: true }
}
