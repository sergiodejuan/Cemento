import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createClient()

  try {
    // Verify webhook token
    const { data: webhook, error: webhookError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("token", token)
      .eq("is_active", true)
      .single()

    if (webhookError || !webhook) {
      return NextResponse.json(
        { error: "Invalid or inactive webhook token" },
        { status: 401 }
      )
    }

    const payload = await request.json()

    // Map common field names from different sources (Make, Zapier, native forms)
    const leadData = {
      first_name: payload.first_name || payload.firstName || payload.name?.split(" ")[0] || "Unknown",
      last_name: payload.last_name || payload.lastName || payload.name?.split(" ").slice(1).join(" ") || null,
      email: payload.email || payload.Email || payload.correo,
      phone: payload.phone || payload.Phone || payload.telefono || payload.tel || null,
      company: payload.company || payload.Company || payload.empresa || null,
      job_title: payload.job_title || payload.jobTitle || payload.cargo || null,
      campaign_id: payload.campaign_id || webhook.default_campaign_id,
      source: payload.source || webhook.default_source,
      status: "new" as const,
      notes: payload.notes || payload.message || payload.mensaje || null,
      meta_lead_id: payload.meta_lead_id || payload.leadgen_id || null,
      form_data: payload,
    }

    // Validate required fields
    if (!leadData.email && !leadData.phone) {
      // Log error
      await supabase.from("webhook_logs").insert({
        webhook_id: webhook.id,
        payload,
        status: "error",
        error_message: "Email or phone is required",
      })

      return NextResponse.json(
        { error: "Email or phone is required" },
        { status: 400 }
      )
    }

    // Insert lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert(leadData)
      .select()
      .single()

    if (leadError) {
      // Log error
      await supabase.from("webhook_logs").insert({
        webhook_id: webhook.id,
        payload,
        status: "error",
        error_message: leadError.message,
      })

      return NextResponse.json(
        { error: "Failed to create lead", details: leadError.message },
        { status: 500 }
      )
    }

    // Log success
    await supabase.from("webhook_logs").insert({
      webhook_id: webhook.id,
      payload,
      status: "success",
      lead_id: lead.id,
    })

    // Create initial activity
    await supabase.from("lead_activities").insert({
      lead_id: lead.id,
      activity_type: "status_change",
      description: `Lead creado vía webhook "${webhook.name}"`,
      new_value: "new",
    })

    return NextResponse.json(
      { success: true, lead_id: lead.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Also support GET for testing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createClient()

  const { data: webhook } = await supabase
    .from("webhooks")
    .select("name, is_active")
    .eq("token", token)
    .single()

  if (!webhook) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 })
  }

  return NextResponse.json({
    name: webhook.name,
    status: webhook.is_active ? "active" : "inactive",
    message: "Webhook is configured. Send POST request with lead data.",
  })
}
