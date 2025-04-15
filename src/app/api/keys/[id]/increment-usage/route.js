import { NextResponse } from 'next/server';
import { apiKeyService } from '@/lib/supabase';

// POST /api/keys/[id]/increment-usage - Increment the usage count of an API key
export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    // Increment the usage count
    const updatedApiKey = await apiKeyService.incrementUsageCount(id);
    
    return NextResponse.json({ success: true, data: updatedApiKey });
  } catch (error) {
    console.error('Error incrementing API key usage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment API key usage' },
      { status: 500 }
    );
  }
} 