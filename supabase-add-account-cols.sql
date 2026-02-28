ALTER TABLE queue_config ADD COLUMN IF NOT EXISTS account_name text NOT NULL DEFAULT '';
ALTER TABLE queue_config ADD COLUMN IF NOT EXISTS account_number text NOT NULL DEFAULT '';
