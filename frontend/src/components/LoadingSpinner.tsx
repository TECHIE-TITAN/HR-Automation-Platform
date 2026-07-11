import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Processing your resume...</p>
      <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
    </div>
  );
};
