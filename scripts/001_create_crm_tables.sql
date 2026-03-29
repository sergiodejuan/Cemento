-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  meta_campaign_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'draft')),
  objective TEXT,
  budget DECIMAL(10, 2) DEFAULT 0,
  spent DECIMAL(10, 2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  ctr DECIMAL(5, 4) DEFAULT 0,
  cpc DECIMAL(10, 2) DEFAULT 0,
  cpm DECIMAL(10, 2) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  source TEXT DEFAULT 'meta_ads',
  notes TEXT,
  meta_lead_id TEXT UNIQUE,
  form_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead_activities table for tracking interactions
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('status_change', 'note', 'email', 'call', 'meeting')),
  description TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);

-- Insert sample campaigns
INSERT INTO campaigns (name, meta_campaign_id, status, objective, budget, spent, impressions, clicks, conversions, ctr, cpc, cpm, start_date, end_date) VALUES
('Summer Sale 2024', 'meta_camp_001', 'active', 'conversions', 5000.00, 3250.50, 125000, 4500, 180, 0.036, 0.72, 26.00, '2024-06-01', '2024-08-31'),
('Brand Awareness Q3', 'meta_camp_002', 'active', 'awareness', 3000.00, 1850.00, 250000, 2100, 45, 0.0084, 0.88, 7.40, '2024-07-01', '2024-09-30'),
('Lead Gen - Enterprise', 'meta_camp_003', 'paused', 'lead_generation', 8000.00, 6200.00, 85000, 3200, 320, 0.0376, 1.94, 72.94, '2024-05-15', '2024-07-31'),
('Product Launch', 'meta_camp_004', 'completed', 'conversions', 10000.00, 9850.00, 450000, 12500, 850, 0.0278, 0.79, 21.89, '2024-01-01', '2024-03-31'),
('Retargeting Campaign', 'meta_camp_005', 'active', 'conversions', 2000.00, 890.00, 45000, 1800, 95, 0.04, 0.49, 19.78, '2024-08-01', '2024-10-31');

-- Insert sample leads
INSERT INTO leads (campaign_id, first_name, last_name, email, phone, company, job_title, status, source, notes) VALUES
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_001'), 'Juan', 'Garcia', 'juan.garcia@email.com', '+1234567890', 'Tech Solutions', 'Marketing Manager', 'new', 'meta_ads', 'Interested in premium package'),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_001'), 'Maria', 'Lopez', 'maria.lopez@email.com', '+1234567891', 'Digital Agency', 'CEO', 'contacted', 'meta_ads', 'Follow up scheduled for next week'),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_002'), 'Carlos', 'Rodriguez', 'carlos.r@email.com', '+1234567892', 'Startup Inc', 'CTO', 'qualified', 'meta_ads', 'Very interested, requested demo'),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_003'), 'Ana', 'Martinez', 'ana.m@email.com', '+1234567893', 'Enterprise Corp', 'VP Sales', 'converted', 'meta_ads', 'Signed enterprise contract'),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_003'), 'Pedro', 'Sanchez', 'pedro.s@email.com', '+1234567894', 'Global Services', 'Director', 'lost', 'meta_ads', 'Chose competitor'),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_004'), 'Laura', 'Fernandez', 'laura.f@email.com', '+1234567895', 'Creative Studio', 'Designer', 'new', 'meta_ads', NULL),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_005'), 'Miguel', 'Torres', 'miguel.t@email.com', '+1234567896', 'E-commerce Plus', 'Owner', 'contacted', 'meta_ads', 'Interested in monthly plan'),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_001'), 'Sofia', 'Ruiz', 'sofia.r@email.com', '+1234567897', 'Media Group', 'Producer', 'qualified', 'meta_ads', 'Ready for proposal'),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_002'), 'Diego', 'Moreno', 'diego.m@email.com', '+1234567898', 'Innovation Labs', 'Founder', 'new', 'meta_ads', NULL),
((SELECT id FROM campaigns WHERE meta_campaign_id = 'meta_camp_005'), 'Carmen', 'Navarro', 'carmen.n@email.com', '+1234567899', 'Retail Solutions', 'Manager', 'contacted', 'meta_ads', 'Requested pricing info');

-- Insert sample activities
INSERT INTO lead_activities (lead_id, activity_type, description, previous_value, new_value) 
SELECT id, 'status_change', 'Lead created', NULL, 'new' FROM leads WHERE status = 'new'
UNION ALL
SELECT id, 'status_change', 'Status updated to contacted', 'new', 'contacted' FROM leads WHERE status = 'contacted'
UNION ALL
SELECT id, 'status_change', 'Lead qualified after demo', 'contacted', 'qualified' FROM leads WHERE status = 'qualified'
UNION ALL
SELECT id, 'status_change', 'Deal closed - converted', 'qualified', 'converted' FROM leads WHERE status = 'converted'
UNION ALL
SELECT id, 'status_change', 'Lead lost to competitor', 'qualified', 'lost' FROM leads WHERE status = 'lost';
