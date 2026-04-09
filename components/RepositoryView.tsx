'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  loadRepoFolders, saveRepoFolder, deleteRepoFolder as removeRepoFolder,
  loadAllRepoFiles, loadRepoFiles, uploadRepoFile, deleteRepoFile as removeRepoFile,
  type RepoFolder, type RepoFile,
} from '@/lib/storage';

type FileWithPreview = RepoFile & { url?: string; dataUrl?: string };

const MONTH_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(type: string, size: number = 18) {
  if (type && type.startsWith('image/')) return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
  if (type === 'application/pdf') return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
    </svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function isImageType(type: string) {
  return /^image\/(jpeg|jpg|png|gif|webp|svg)/.test(type || '');
}

function useHoverDelay(delay: number = 1000) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEnter = useCallback((id: string) => {
    timerRef.current = setTimeout(() => setHoveredId(id), delay);
  }, [delay]);
  const onLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredId(null);
  }, []);
  return { hoveredId, onEnter, onLeave };
}

export default function RepositoryView() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [folders, setFolders] = useState<RepoFolder[]>([]);
  const [allFiles, setAllFiles] = useState<FileWithPreview[]>([]);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [folderFiles, setFolderFiles] = useState<FileWithPreview[]>([]);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderHover = useHoverDelay(1000);
  const fileHover = useHoverDelay(1000);

  // Load folders and all file metadata on mount
  useEffect(() => {
    loadRepoFolders().then(setFolders);
    loadAllRepoFiles().then(setAllFiles);
  }, []);

  // Load files when opening a folder
  useEffect(() => {
    if (openFolderId) {
      loadRepoFiles(openFolderId).then(setFolderFiles);
    } else {
      setFolderFiles([]);
    }
  }, [openFolderId]);

  const monthFolders = folders.filter(f => f.month === selectedMonth + 1);
  const openFolder = openFolderId ? folders.find(f => f.id === openFolderId) : null;

  const getFilesForFolder = (folderId: string) => allFiles.filter(f => f.folder_id === folderId);

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const folder: RepoFolder = {
      id: crypto.randomUUID(),
      name: newFolderName.trim(),
      month: selectedMonth + 1,
      year: currentYear,
    };
    setFolders([...folders, folder]);
    setNewFolderName('');
    setCreatingFolder(false);
    await saveRepoFolder(folder);
  };

  const deleteFolder = async (folderId: string) => {
    setFolders(folders.filter(f => f.id !== folderId));
    setAllFiles(allFiles.filter(f => f.folder_id !== folderId));
    if (openFolderId === folderId) setOpenFolderId(null);
    await removeRepoFolder(folderId);
  };

  const handleFiles = async (fileList: FileList) => {
    if (!openFolderId) return;
    for (const file of Array.from(fileList)) {
      const saved = await uploadRepoFile(openFolderId, file);
      setFolderFiles(prev => [...prev, saved]);
      setAllFiles(prev => [...prev, saved]);
    }
  };

  const deleteFile = async (fileId: string, filePath: string) => {
    setFolderFiles(prev => prev.filter(f => f.id !== fileId));
    setAllFiles(prev => prev.filter(f => f.id !== fileId));
    await removeRepoFile(fileId, filePath);
  };

  const downloadFile = (file: FileWithPreview) => {
    const a = document.createElement('a');
    a.href = file.url || file.dataUrl || '';
    a.download = file.file_name;
    a.target = '_blank';
    a.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Repository</h1>
        <p className="text-sm text-[#666666] mt-1">File storage organized by month</p>
      </div>

      {/* Month Selector */}
      <div className="flex gap-1.5 mb-6">
        {MONTH_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => { setSelectedMonth(i); setOpenFolderId(null); }}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
              selectedMonth === i ? 'bg-[#1a2744] text-white' : 'bg-[#f8f9fb] text-[#666666] hover:bg-gray-200'
            }`}
            title={MONTH_NAMES[i]}
          >{label}</button>
        ))}
      </div>

      {/* Breadcrumb + Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setOpenFolderId(null)} className={`font-medium ${openFolder ? 'text-[#3d5a80] hover:underline cursor-pointer' : 'text-[#111111]'}`}>
            {MONTH_NAMES[selectedMonth]}
          </button>
          {openFolder && (
            <><span className="text-[#999999]">&gt;</span><span className="font-medium text-[#111111]">{openFolder.name}</span></>
          )}
        </div>
        {!openFolder && (
          <button onClick={() => setCreatingFolder(true)} className="px-3 py-1.5 bg-[#1a2744] text-white text-sm font-medium rounded-lg hover:bg-[#243356] transition-colors inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
            New Folder
          </button>
        )}
      </div>

      {/* Create Folder Input */}
      {creatingFolder && !openFolder && (
        <div className="flex items-center gap-2 mb-4 bg-white border border-gray-200 rounded-lg p-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d5a80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
          <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') { setCreatingFolder(false); setNewFolderName(''); } }} placeholder="Folder name" className="flex-1 text-sm text-[#111111] outline-none placeholder:text-[#999999]" autoFocus />
          <button onClick={createFolder} className="text-green-600 hover:text-green-700"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></button>
          <button onClick={() => { setCreatingFolder(false); setNewFolderName(''); }} className="text-[#999999] hover:text-[#666666]"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg></button>
        </div>
      )}

      {/* Folder List View */}
      {!openFolder && (
        <>
          {monthFolders.length === 0 && !creatingFolder ? (
            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
              <div className="text-[#999999] mb-3 flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg></div>
              <p className="text-sm font-medium text-[#666666]">No folders for {MONTH_NAMES[selectedMonth]}.</p>
              <p className="text-xs text-[#999999] mt-1">Click + New Folder to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {monthFolders.map((folder) => {
                const fFiles = getFilesForFolder(folder.id);
                return (
                  <div key={folder.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group relative"
                    onClick={() => setOpenFolderId(folder.id)}
                    onMouseEnter={() => folderHover.onEnter(folder.id)}
                    onMouseLeave={folderHover.onLeave}
                  >
                    <div className="text-[#3d5a80] mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg></div>
                    <h3 className="text-sm font-medium text-[#111111] truncate">{folder.name}</h3>
                    <p className="text-xs text-[#999999] mt-0.5">{fFiles.length} file{fFiles.length !== 1 ? 's' : ''}</p>
                    <button onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#999999] hover:text-red-500 p-1" title="Delete folder">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    </button>
                    {folderHover.hoveredId === folder.id && (
                      <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-20 min-w-[220px]" onClick={(e) => e.stopPropagation()}>
                        {fFiles.length === 0 ? <p className="text-xs text-[#999999] italic">Empty folder</p> : (
                          <>{fFiles.slice(0, 5).map((file) => (
                            <div key={file.id} className="flex items-center gap-2 py-1.5">
                              <div className="text-[#3d5a80] flex-shrink-0">{getFileIcon(file.file_type, 14)}</div>
                              <span className="text-xs text-[#111111] truncate flex-1">{file.file_name}</span>
                              <span className="text-[10px] text-[#999999] flex-shrink-0">{formatFileSize(file.file_size)}</span>
                            </div>
                          ))}
                          {fFiles.length > 5 && <p className="text-[10px] text-[#999999] pt-1.5 border-t border-gray-100 mt-1">and {fFiles.length - 5} more file{fFiles.length - 5 !== 1 ? 's' : ''}...</p>}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Inside Folder View */}
      {openFolder && (
        <div>
          <div
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-6 ${isDragging ? 'border-[#3d5a80] bg-blue-50' : 'border-gray-200 hover:border-[#3d5a80] hover:bg-[#f8f9fb]'}`}
          >
            <div className="text-[#999999] mb-2 flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg></div>
            <p className="text-sm font-medium text-[#111111]">Drop files here or click to upload</p>
            <p className="text-xs text-[#999999] mt-0.5">Any file type supported</p>
            <input ref={fileInputRef} type="file" multiple onChange={(e) => e.target.files && handleFiles(e.target.files)} className="hidden" />
          </div>

          {folderFiles.length === 0 ? (
            <div className="text-center py-8"><p className="text-sm text-[#999999]">No files in this folder yet</p></div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              {folderFiles.map((file, i) => (
                <div key={file.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f8f9fb] transition-colors relative ${i < folderFiles.length - 1 ? 'border-b border-gray-50' : ''}`}
                  onMouseEnter={() => fileHover.onEnter(file.id)}
                  onMouseLeave={fileHover.onLeave}
                >
                  <div className="text-[#3d5a80] flex-shrink-0">{getFileIcon(file.file_type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111111] truncate">{file.file_name}</p>
                    <p className="text-xs text-[#999999]">{formatFileSize(file.file_size)} · {file.created_at ? new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</p>
                  </div>
                  <button onClick={() => downloadFile(file)} className="text-[#3d5a80] hover:text-[#1a2744] transition-colors p-1.5" title="Download">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                  </button>
                  <button onClick={() => deleteFile(file.id, file.file_path)} className="text-[#999999] hover:text-red-500 transition-colors p-1.5" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                  {fileHover.hoveredId === file.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-20">
                      {isImageType(file.file_type) ? (
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={file.url || file.dataUrl || ''} alt={file.file_name} className="max-w-[300px] max-h-[300px] rounded-lg object-contain" />
                          <p className="text-[10px] text-[#999999] mt-2 text-center">{file.file_name}</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="text-[#3d5a80]">{getFileIcon(file.file_type, 32)}</div>
                          <div><p className="text-sm font-medium text-[#111111]">{file.file_name}</p><p className="text-xs text-[#999999]">{formatFileSize(file.file_size)}</p></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
