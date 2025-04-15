'use client';

export default function Overview() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to your API management dashboard. Here you can manage your API keys and monitor your usage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* API Usage Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">API Usage</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-indigo-600">24</span>
              <span className="ml-2 text-sm text-gray-500">/ 1,000 requests</span>
            </div>
            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '2.4%' }}></div>
            </div>
          </div>

          {/* Active Keys Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Active API Keys</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-green-600">3</span>
              <span className="ml-2 text-sm text-gray-500">keys</span>
            </div>
          </div>

          {/* Documentation Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Documentation</h2>
            <p className="text-sm text-gray-600 mb-4">
              Learn how to integrate our API into your applications.
            </p>
            <a 
              href="/docs" 
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View Documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
