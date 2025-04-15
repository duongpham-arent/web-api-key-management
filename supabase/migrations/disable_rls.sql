-- Disable RLS on api_keys table
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'api_keys'; 