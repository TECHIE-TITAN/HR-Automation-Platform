import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ResumeUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onFileSelected, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        onFileSelected(file);
      } else {
        alert('Please select a PDF file');
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer transition-all ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-blue-500 hover:bg-blue-50'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
        <p className="text-lg font-semibold text-gray-700">Upload Resume</p>
        <p className="text-sm text-gray-500 mt-1">Click to select a PDF file</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
