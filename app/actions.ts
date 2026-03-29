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

export async function createWebhook(data: {
  name: string
  default_campaign_id: string | null
  default_source: string
}) {
  const supabase = await createClient()

  // Generate unique token
  const token = crypto.randomUUID().replace(/-/g, "")

  const { error } = await supabase.from("webhooks").insert({
    name: data.name,
    token,
    default_campaign_id: data.default_campaign_id,
    default_source: data.default_source,
    is_active: true,
  })

  if (error) {
    throw new Error("Error al crear el webhook")
  }

  revalidatePath("/integrations")
  return { success: true }
}

export async function toggleWebhookStatus(id: string, isActive: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("webhooks")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    throw new Error("Error al actualizar el webhook")
  }

  revalidatePath("/integrations")
  return { success: true }
}

export async function deleteWebhook(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("webhooks").delete().eq("id", id)

  if (error) {
    throw new Error("Error al eliminar el webhook")
  }

  revalidatePath("/integrations")
  return { success: true }
}
