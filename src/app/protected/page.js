'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ProtectedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      const apiKey = sessionStorage.getItem('apiKey');
      
      if (!apiKey) {
        toast.error('No API key found');
        router.push('/playground');
        return;
      }

      try {
        const response = await fetch('/api/validate-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey }),
        });

        const data = await response.json();

        if (!data.success) {
          toast.error('Invalid API key');
          router.push('/playground');
        }
      } catch (error) {
        toast.error('Failed to validate API key');
        router.push('/playground');
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-gray-500">Validating access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Protected Resource</h1>
          <p className="text-gray-600 mb-6">
            You have successfully accessed this protected page using a valid API key.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="ml-2 text-sm text-green-700">Your API key is valid and active</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Example API Usage</h2>
            <pre className="bg-gray-800 text-gray-200 rounded-lg p-4 overflow-x-auto">
              <code>{`curl -X POST https://api.example.com/data \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "example"}'`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 