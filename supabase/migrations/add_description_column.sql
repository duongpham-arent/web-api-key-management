-- Add description column to api_keys table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'api_keys'
    AND column_name = 'description'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN description TEXT;
  END IF;
END $$; 