-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  key TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  usage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON api_keys
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow all operations for anonymous users
CREATE POLICY "Allow all operations for anonymous users" ON api_keys
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_api_keys_updated_at
BEFORE UPDATE ON api_keys
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION increment_api_key_usage(key_id UUID)
RETURNS api_keys AS $$
DECLARE
  updated_key api_keys;
BEGIN
  UPDATE api_keys
  SET usage = usage + 1,
      updated_at = NOW()
  WHERE id = key_id
  RETURNING * INTO updated_key;
  
  RETURN updated_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 