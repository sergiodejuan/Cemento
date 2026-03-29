export interface Campaign {
  id: string
  name: string
  meta_campaign_id: string | null
  status: 'active' | 'paused' | 'completed' | 'draft'
  objective: string | null
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  cpm: number
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  campaign_id: string | null
  first_name: string
  last_name: string | null
  email: string
  phone: string | null
  company: string | null
  job_title: string | null
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string
  notes: string | null
  meta_lead_id: string | null
  form_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
  campaign?: Campaign
}

export interface LeadActivity {
  id: string
  lead_id: string
  activity_type: 'status_change' | 'note' | 'email' | 'call' | 'meeting'
  description: string
  previous_value: string | null
  new_value: string | null
  created_at: string
}

export type LeadStatus = Lead['status']
export type CampaignStatus = Campaign['status']

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'Nuevo', color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Contactado', color: 'bg-yellow-100 text-yellow-800' },
  qualified: { label: 'Calificado', color: 'bg-green-100 text-green-800' },
  converted: { label: 'Convertido', color: 'bg-emerald-100 text-emerald-800' },
  lost: { label: 'Perdido', color: 'bg-red-100 text-red-800' },
}

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string }> = {
  active: { label: 'Activa', color: 'bg-green-100 text-green-800' },
  paused: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completada', color: 'bg-gray-100 text-gray-800' },
  draft: { label: 'Borrador', color: 'bg-blue-100 text-blue-800' },
}
