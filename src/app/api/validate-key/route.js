import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API key is required' });
    }

    // Query the database to check if the API key exists and is active
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, active, usage')
      .eq('key', apiKey)
      .single();

    if (error) {
      console.error('Error validating API key:', error);
      return NextResponse.json({ success: false, error: 'Failed to validate API key' });
    }

    // Check if the API key exists and is active
    if (data && data.active) {
      // Increment the usage count
      const { error: updateError } = await supabase
        .from('api_keys')
        .update({ usage: (data.usage || 0) + 1 })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error updating usage count:', updateError);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid API key' });
  } catch (error) {
    console.error('Error in validate-key route:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });
  }
} 