'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function TestPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/test-connection');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to test connection');
        }
        
        setResult(data);
        toast.success('Connection test completed');
      } catch (err) {
        console.error('Error testing connection:', err);
        setError(err.message);
        toast.error('Failed to test connection');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Supabase Connection Test
            </h3>
            
            {loading ? (
              <div className="mt-4">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="mt-4">
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : result ? (
              <div className="mt-4">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Success
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>{result.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Connection Test</h4>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Status: {result.connectionTest}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Table Info Test</h4>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Status: {result.tableInfoTest}</p>
                  </div>
                </div>
                
                {result.tableInfo && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900">Table Information</h4>
                    <div className="mt-2">
                      <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs">
                        {JSON.stringify(result.tableInfo, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
} 