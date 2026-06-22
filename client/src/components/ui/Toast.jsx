import React, { useEffect } from 'react';

export function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg"
      style={{ backgroundColor: type === 'error' ? '#D85A30' : '#3B4A2F', animation: 'fadeUp 0.2s ease-out' }}
    >
      {message}
    </div>
  );
}
