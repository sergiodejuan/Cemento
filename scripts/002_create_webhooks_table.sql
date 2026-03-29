-- Webhooks configuration table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  webhook_key TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  source TEXT NOT NULL DEFAULT 'custom', -- 'make', 'zapier', 'meta', 'custom'
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  leads_received INTEGER DEFAULT 0,
  last_received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  payload JSONB,
  status TEXT NOT NULL DEFAULT 'success', -- 'success', 'error'
  error_message TEXT,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_key ON webhooks(webhook_key);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(is_active);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON webhook_logs(created_at);

-- Insert sample webhook
INSERT INTO webhooks (name, source, description) VALUES
  ('Make.com Integration', 'make', 'Webhook principal para recibir leads de Make.com'),
  ('Meta Lead Ads', 'meta', 'Webhook directo para Facebook Lead Ads'),
  ('Website Contact Form', 'custom', 'Formulario de contacto de la web');
