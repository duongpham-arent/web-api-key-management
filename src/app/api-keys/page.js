'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ApiKeyModal from './components/ApiKeyModal';
import ConfirmModal from './components/ConfirmModal';
import ApiKeyRow from './components/ApiKeyRow';
import useApiKeys from './hooks/useApiKeys';

export default function ApiKeysPage() {
  const {
    apiKeys,
    isLoading,
    hiddenKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    regenerateApiKey,
    toggleKeyVisibility,
  } = useApiKeys();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
            <p className="mt-2 text-sm text-gray-600">
              The key is used to authenticate your requests to the API. To learn more, see the documentation.
            </p>
          </div>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New API Key
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
                <p className="text-sm text-gray-500">Loading API keys...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">NAME</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">USAGE</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">KEY</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">OPTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        No API keys found. Create your first API key to get started.
                      </td>
                    </tr>
                  ) : (
                    apiKeys.map((key) => (
                      <ApiKeyRow
                        key={key.id}
                        apiKey={key}
                        isHidden={hiddenKeys[key.id]}
                        onToggleVisibility={() => toggleKeyVisibility(key.id)}
                        onEdit={() => {
                          setSelectedKey(key);
                          setIsEditModalOpen(true);
                        }}
                        onDelete={() => {
                          setSelectedKey(key);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <ApiKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createApiKey}
      />

      {/* Edit Modal */}
      <ApiKeyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={updateApiKey}
        initialData={selectedKey}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteApiKey(selectedKey?.id)}
        title="Delete API Key"
        message="Are you sure you want to delete this API key? This action cannot be undone."
      />

      {/* Regenerate Confirmation Modal */}
      <ConfirmModal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        onConfirm={() => regenerateApiKey(selectedKey?.id)}
        title="Regenerate API Key"
        message="Are you sure you want to regenerate this API key? The old key will no longer work."
      />
    </div>
  );
} 