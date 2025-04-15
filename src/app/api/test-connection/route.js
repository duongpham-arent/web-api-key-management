import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/test-connection - Test the Supabase connection
export async function GET() {
  try {
    // Test the connection by querying the api_keys table
    const { data, error } = await supabase
      .from('api_keys')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Error testing connection:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to connect to Supabase',
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }
    
    // Get table information
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'api_keys' });
    
    if (tableError) {
      console.error('Error getting table info:', tableError);
      return NextResponse.json(
        { 
          success: true, 
          message: 'Connected to Supabase, but failed to get table info',
          connectionTest: 'success',
          tableInfoTest: 'failed',
          error: tableError.message
        }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Supabase',
      connectionTest: 'success',
      tableInfoTest: 'success',
      tableInfo
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Unexpected error',
        details: error.message
      },
      { status: 500 }
    );
  }
} 