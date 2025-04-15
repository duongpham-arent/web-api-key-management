// This script runs the migration to add the description column to the api_keys table
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env.local');
  process.exit(1);
}

// Create a Supabase client with the service key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Running migration to add description column...');
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', 'add_description_column.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSql });
    
    if (error) {
      console.error('Error running migration:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully!');
    
    // Verify the column exists
    const { data, error: verifyError } = await supabase.rpc('get_table_info', { table_name: 'api_keys' });
    
    if (verifyError) {
      console.error('Error verifying table structure:', verifyError);
      process.exit(1);
    }
    
    console.log('Table structure:', JSON.stringify(data, null, 2));
    
    // Check if description column exists
    const hasDescriptionColumn = data.columns.some(col => col.column_name === 'description');
    
    if (hasDescriptionColumn) {
      console.log('Description column exists in the api_keys table.');
    } else {
      console.error('Description column does not exist in the api_keys table.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

runMigration(); 