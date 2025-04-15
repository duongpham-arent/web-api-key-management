import { NextResponse } from 'next/server';
import { apiKeyService } from '@/lib/supabase';

// GET /api/keys/[id] - Get a specific API key
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get all API keys and find the one with the matching ID
    const apiKeys = await apiKeyService.getAllApiKeys();
    const apiKey = apiKeys.find(key => key.id === id);
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: apiKey });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

// PUT /api/keys/[id] - Update an API key
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, active } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Create update data with only the fields we know exist
    const updateData = {
      name,
      active
    };
    
    // Update the API key
    const updatedApiKey = await apiKeyService.updateApiKey(id, updateData);
    
    return NextResponse.json({ success: true, data: updatedApiKey });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE /api/keys/[id] - Delete an API key
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Delete the API key
    await apiKeyService.deleteApiKey(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
} 