'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Search,
  FileText,
  FileSpreadsheet,
  FileImage,
  Presentation,
  File,
  Trash2,
  Filter,
  FolderOpen,
  HardDrive,
} from 'lucide-react';
import { dataStore } from '@/lib/mock-data';

const fileIcons: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
  docx: { icon: FileText, color: '#2563eb', bg: '#eff6ff' },
  doc: { icon: FileText, color: '#2563eb', bg: '#eff6ff' },
  xlsx: { icon: FileSpreadsheet, color: '#16a34a', bg: '#f0fdf4' },
  xls: { icon: FileSpreadsheet, color: '#16a34a', bg: '#f0fdf4' },
  pptx: { icon: Presentation, color: '#ea580c', bg: '#fff7ed' },
  ppt: { icon: Presentation, color: '#ea580c', bg: '#fff7ed' },
  md: { icon: FileText, color: '#374151', bg: '#f3f4f6' },
  png: { icon: FileImage, color: '#7c3aed', bg: '#faf5ff' },
  jpg: { icon: FileImage, color: '#7c3aed', bg: '#faf5ff' },
  jpeg: { icon: FileImage, color: '#7c3aed', bg: '#faf5ff' },
  pdf: { icon: File, color: '#dc2626', bg: '#fef2f2' },
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = dataStore.getAllFiles().filter(f => {
    if (filterCategory !== 'all' && f.category !== filterCategory) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = Array.from(new Set(dataStore.getAllFiles().map(f => f.category)));
  const totalSize = dataStore.getAllFiles().reduce((s, f) => s + f.file_size, 0);

  const getFileIcon = (type: string) => {
    const config = fileIcons[type] || { icon: File, color: '#6b7280', bg: '#f3f4f6' };
    return config;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>Files</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            {files.length} files - {formatFileSize(totalSize)} total
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}
        >
          <Upload size={18} /> Upload Files
        </button>
        <input ref={fileInputRef} type="file" multiple accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.md,.png,.jpg,.jpeg,.pdf" style={{ display: 'none' }} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        style={{
          border: `2px dashed ${dragOver ? '#16a34a' : '#d1d5db'}`,
          borderRadius: '14px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '24px',
          background: dragOver ? '#f0fdf4' : '#fafafa',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={32} color={dragOver ? '#16a34a' : '#9ca3af'} style={{ margin: '0 auto 12px' }} />
        <div style={{ fontSize: '15px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
          {dragOver ? 'Drop files here' : 'Drag & drop files here'}
        </div>
        <div style={{ fontSize: '13px', color: '#9ca3af' }}>
          Supports DOC, DOCX, XLS, XLSX, PPT, PPTX, MD, PNG, JPG, PDF
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', borderRadius: '10px', padding: '8px 16px', border: '1px solid #e5e7eb', flex: 1, maxWidth: '320px' }}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', padding: '4px', background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setFilterCategory('all')}
            style={{ padding: '6px 14px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: filterCategory === 'all' ? '#16a34a' : 'transparent', color: filterCategory === 'all' ? 'white' : '#6b7280' }}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{ padding: '6px 14px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: filterCategory === cat ? '#16a34a' : 'transparent', color: filterCategory === cat ? 'white' : '#6b7280' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* File list */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              {['Name', 'Category', 'Size', 'Uploaded By', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', background: '#f9fafb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.map(file => {
              const iconConfig = getFileIcon(file.file_type);
              const Icon = iconConfig.icon;
              return (
                <tr key={file.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: iconConfig.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} color={iconConfig.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{file.name}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>{file.file_type}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', background: '#f3f4f6', borderRadius: '20px', fontSize: '12px', color: '#6b7280' }}>{file.category}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{formatFileSize(file.file_size)}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{file.uploaded_by}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#9ca3af' }}>{new Date(file.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ padding: '6px 12px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Download size={14} /> Download
                      </button>
                      <button style={{ padding: '6px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Storage info */}
      <div style={{ marginTop: '24px', background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <HardDrive size={24} color="#16a34a" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Storage Used</span>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{formatFileSize(totalSize)} / 10 GB</span>
          </div>
          <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(totalSize / (10 * 1024 * 1024 * 1024)) * 100}%`, background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: '3px', minWidth: '2%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
