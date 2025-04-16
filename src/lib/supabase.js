import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Debug environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseKey ? 'Set' : 'Not set');

// Create a single supabase client for interacting with your database
export const supabase = createClientComponentClient();

// API Key related functions
export const apiKeyService = {
  // Get all API keys
  async getAllApiKeys() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Create a new API key
  async createApiKey(apiKeyData) {
    console.log('Creating API key with data:', apiKeyData);
    
    // Remove any undefined or null values to avoid schema errors
    const cleanData = Object.fromEntries(
      Object.entries(apiKeyData).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([cleanData])
      .select();
    
    if (error) {
      console.error('Error creating API key:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('API key created successfully:', data[0]);
    return data[0];
  },
  
  // Update an API key
  async updateApiKey(id, apiKeyData) {
    const { data, error } = await supabase
      .from('api_keys')
      .update(apiKeyData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete an API key
  async deleteApiKey(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Regenerate an API key
  async regenerateApiKey(id) {
    const newKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const { data, error } = await supabase
      .from('api_keys')
      .update({ key: newKey })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Increment usage count
  async incrementUsageCount(id) {
    const { data, error } = await supabase
      .from('api_keys')
      .update({ usage: supabase.raw('usage + 1') })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
}; 