import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set');

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
});

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
    // Remove any undefined or null values to avoid schema errors
    const cleanData = Object.fromEntries(
      Object.entries(apiKeyData).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    const { data, error } = await supabase
      .from('api_keys')
      .update(cleanData)
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
    // Generate a new random API key
    const newKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const { data, error } = await supabase
      .from('api_keys')
      .update({ key: newKey, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Increment usage count for an API key
  async incrementUsageCount(id) {
    const { data, error } = await supabase.rpc('increment_api_key_usage', { key_id: id });
    
    if (error) throw error;
    return data;
  }
}; 