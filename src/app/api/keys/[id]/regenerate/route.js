import { NextResponse } from 'next/server';
import { apiKeyService } from '@/lib/supabase';

// POST /api/keys/[id]/regenerate - Regenerate an API key
export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    // Regenerate the API key
    const regeneratedApiKey = await apiKeyService.regenerateApiKey(id);
    
    return NextResponse.json({ success: true, data: regeneratedApiKey });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to regenerate API key' },
      { status: 500 }
    );
  }
} 