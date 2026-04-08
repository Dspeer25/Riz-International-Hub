'use client';

import { useState, useRef } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded_at: string;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    );
  }
  if (type === 'application/pdf') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

export default function FileUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded_at: new Date().toISOString(),
    }));
    setFiles([...newFiles, ...files]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 ${
          isDragging
            ? 'border-[#3d5a80] bg-blue-50'
            : 'border-gray-200 hover:border-[#3d5a80] hover:bg-[#f8f9fb]'
        }`}
      >
        <div className="text-[#999999] mb-3 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#111111]">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-[#999999] mt-1">
          Images, PDFs, and documents supported
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
        />
      </div>

      {/* File grid */}
      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-[#f8f9fb] rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="text-[#3d5a80] mb-3">
                {getFileIcon(file.type)}
              </div>
              <h4 className="text-sm font-medium text-[#111111] truncate" title={file.name}>
                {file.name}
              </h4>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-[#999999]">{formatFileSize(file.size)}</span>
                <span className="text-xs text-[#999999]">·</span>
                <span className="text-xs text-[#999999]">
                  {new Date(file.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 text-xs font-medium text-[#3d5a80] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Download
                </button>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="py-1.5 px-3 text-xs font-medium text-red-500 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-[#999999]">No files uploaded yet</p>
        </div>
      )}
    </div>
  );
}
