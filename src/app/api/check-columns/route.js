import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/check-columns - Check if the description column exists in the api_keys table
export async function GET() {
  try {
    // Get table information
    const { data, error } = await supabase
      .rpc('get_table_info', { table_name: 'api_keys' });
    
    if (error) {
      console.error('Error getting table info:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to get table info',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    // Check if description column exists
    const hasDescriptionColumn = data.columns.some(col => col.column_name === 'description');
    
    return NextResponse.json({ 
      success: true, 
      hasDescriptionColumn,
      columns: data.columns.map(col => col.column_name)
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