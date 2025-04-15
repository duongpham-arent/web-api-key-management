-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON api_keys;
DROP POLICY IF EXISTS "Allow all operations for anonymous users" ON api_keys;

-- Create a new policy that allows all operations for all users
CREATE POLICY "Allow all operations for all users" ON api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'api_keys'; 