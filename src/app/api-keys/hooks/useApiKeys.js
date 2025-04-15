'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hiddenKeys, setHiddenKeys] = useState({});

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/keys');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch API keys');
      }
      
      setApiKeys(result.data);
      
      // Set all keys to be hidden by default
      const allKeysHidden = result.data.reduce((acc, key) => {
        acc[key.id] = true;
        return acc;
      }, {});
      
      setHiddenKeys(allKeysHidden);
    } catch (err) {
      setError('Failed to fetch API keys');
      console.error(err);
      toast.error('Failed to fetch API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async (formData) => {
    try {
      const { name } = formData;
      
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create API key');
      }
      
      setApiKeys([result.data, ...apiKeys]);
      toast.success('API key created successfully');
      return result.data;
    } catch (err) {
      console.error('Error creating API key:', err);
      toast.error(`Failed to create API key: ${err.message}`);
      throw err;
    }
  };

  const updateApiKey = async (formData) => {
    try {
      const { id, name, active } = formData;
      
      const response = await fetch(`/api/keys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, active }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update API key');
      }
      
      setApiKeys(apiKeys.map(key => key.id === result.data.id ? result.data : key));
      toast.success('API key updated successfully');
      return result.data;
    } catch (err) {
      console.error('Error updating API key:', err);
      toast.error('Failed to update API key');
      throw err;
    }
  };

  const deleteApiKey = async (id) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete API key');
      }
      
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted successfully');
    } catch (err) {
      console.error('Error deleting API key:', err);
      toast.error('Failed to delete API key');
      throw err;
    }
  };

  const regenerateApiKey = async (id) => {
    try {
      const response = await fetch(`/api/keys/${id}/regenerate`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to regenerate API key');
      }
      
      setApiKeys(apiKeys.map(key => key.id === result.data.id ? result.data : key));
      toast.success('API key regenerated successfully');
      return result.data;
    } catch (err) {
      console.error('Error regenerating API key:', err);
      toast.error('Failed to regenerate API key');
      throw err;
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setHiddenKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  return {
    apiKeys,
    isLoading,
    error,
    hiddenKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    regenerateApiKey,
    toggleKeyVisibility,
  };
} 