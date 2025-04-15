'use client';

import { useState, useEffect } from 'react';

export default function ApiKeyModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    active: true,
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', active: true });
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Edit API Key' : 'Create New API Key'}
        </h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
          onClose();
        }}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          {initialData && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Save Changes' : 'Create Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 