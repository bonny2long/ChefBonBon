// client/src/components/recipes/ScanScreen.jsx
// Placeholder for AI Food Scanner (Phase 6)

import React from 'react';

export default function ScanScreen({ onGoHome }) {
  return (
    <main className="p-4 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center justify-center py-16">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: '#F0EBE0' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B4A2F" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>

        <h2 className="text-lg font-medium text-olive mb-2">
          AI Food Scanner
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Scan your food to identify ingredients<br/>and generate a matching recipe.
        </p>

        <div className="p-4 rounded-lg bg-warm w-full text-center mb-4">
          <p className="text-sm text-gray-500">Coming soon!</p>
        </div>

        <button
          onClick={onGoHome}
          className="px-6 py-2 rounded-full text-white text-sm font-medium"
          style={{ backgroundColor: '#3B4A2F' }}
        >
          Go to Home
        </button>
      </div>
    </main>
  );
}
