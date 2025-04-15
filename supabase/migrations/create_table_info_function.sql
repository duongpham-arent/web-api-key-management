-- Create a function to get table information
CREATE OR REPLACE FUNCTION get_table_info(table_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'columns', (
      SELECT json_agg(
        json_build_object(
          'column_name', column_name,
          'data_type', data_type,
          'is_nullable', is_nullable,
          'column_default', column_default
        )
      )
      FROM information_schema.columns
      WHERE table_name = $1
    ),
    'constraints', (
      SELECT json_agg(
        json_build_object(
          'constraint_name', constraint_name,
          'constraint_type', constraint_type
        )
      )
      FROM information_schema.table_constraints
      WHERE table_name = $1
    ),
    'indexes', (
      SELECT json_agg(
        json_build_object(
          'index_name', indexname,
          'index_def', indexdef
        )
      )
      FROM pg_indexes
      WHERE tablename = $1
    )
  ) INTO result;
  
  RETURN result;
END;
$$; 