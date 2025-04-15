import { NextResponse } from 'next/server';
import { apiKeyService } from '@/lib/supabase';

// GET /api/keys - Get all API keys
export async function GET() {
  try {
    const apiKeys = await apiKeyService.getAllApiKeys();
    return NextResponse.json({ success: true, data: apiKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/keys - Create a new API key
export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate a random API key
    const key = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Create the API key with only the fields we know exist
    const apiKeyData = {
      name,
      key,
      active: true,
      usage: 0
    };
    
    console.log('Creating API key with data:', apiKeyData);
    
    // Create the API key
    const newApiKey = await apiKeyService.createApiKey(apiKeyData);

    console.log('API key created successfully:', newApiKey);
    
    return NextResponse.json({ success: true, data: newApiKey }, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
    return NextResponse.json(
      { success: false, error: 'Failed to create API key', details: error.message },
      { status: 500 }
    );
  }
} 